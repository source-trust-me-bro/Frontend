"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";

const ATTEMPT_KEY = "kaleva:auth-sync";
const ATTEMPT_WINDOW_MS = 15_000;

function recentlyAttempted(): boolean {
  try {
    const last = Number(window.sessionStorage.getItem(ATTEMPT_KEY));

    return Number.isFinite(last) && Date.now() - last < ATTEMPT_WINDOW_MS;
  } catch {
    return false;
  }
}

function markAttempt(): void {
  try {
    window.sessionStorage.setItem(ATTEMPT_KEY, String(Date.now()));
  } catch {
    // Storage can be unavailable; the full-page navigation below still works once.
  }
}

/**
 * Clerk's session cookie lives about a minute. When the browser already has a
 * session but the server saw an expired cookie, a client-side redirect keeps
 * sending the stale cookie and bounces between /dashboard and /sign-in. Here we
 * refresh the token, then do one full-page navigation so the server (and Clerk's
 * handshake) see the fresh cookie. A second failure inside the window stops the
 * loop and offers a sign-out instead.
 */
export function AuthGate({
  children,
  destination = "/dashboard",
}: {
  children: ReactNode;
  destination?: string;
}) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { signOut } = useClerk();
  // Read once at mount, before this component records its own attempt. It is only
  // used after Clerk loads, so server and client markup still match on hydration.
  const [stuck] = useState(
    () => typeof window !== "undefined" && recentlyAttempted(),
  );

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    if (stuck) {
      return;
    }

    markAttempt();

    void getToken({ skipCache: true })
      .catch(() => null)
      .finally(() => window.location.replace(destination));
  }, [isLoaded, isSignedIn, stuck, getToken, destination]);

  if (!isLoaded) {
    return <p className="auth-page__copy">Loading…</p>;
  }

  if (isSignedIn && stuck) {
    return (
      <div className="auth-page__copy" role="alert">
        <p>We could not verify your session with the server.</p>
        <button
          className="workspace__button"
          type="button"
          onClick={() => void signOut({ redirectUrl: "/sign-in" })}
        >
          Sign out and try again
        </button>
      </div>
    );
  }

  if (isSignedIn) {
    return <p className="auth-page__copy">Signing you in…</p>;
  }

  return children;
}
