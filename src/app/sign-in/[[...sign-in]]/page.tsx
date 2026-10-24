import type { Metadata } from "next";
import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

import { AuthGate } from "@/features/auth/components/auth-gate";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your KalevaShorts dashboard to read your personalised, multilingual news feed.",
};

export const instant = false;

export default function SignInPage() {
  return (
    <main className="auth-page">
      <div className="auth-page__panel">
        <Link className="auth-page__brand" href="/">
          <svg
            className="workspace__mark"
            viewBox="0 0 40 28"
            aria-hidden="true"
          >
            <path
              className="workspace__mark-a"
              d="M3 19C10 5 17 5 21 14s11 9 16-6"
            />
            <path
              className="workspace__mark-b"
              d="M3 10c7 13 14 13 18 4s11-10 16 5"
            />
          </svg>
          <span className="workspace__brand-word">KalevaShorts</span>
        </Link>
        <p className="auth-page__copy">
          Sign in to open your feed, pick your language and topics, and keep
          your saved stories and reading history in one place.
        </p>
        <Suspense fallback={<p className="auth-page__copy">Loading sign in…</p>}>
          <AuthGate>
            <SignIn />
          </AuthGate>
        </Suspense>
      </div>
    </main>
  );
}
