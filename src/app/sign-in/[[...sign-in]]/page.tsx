import type { Metadata } from "next";
import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your KalevaShorts dashboard with Clerk to sync your bilingual Finnish–English reading profile.",
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
          Sign in to open your dashboard, choose English or Suomi, and keep
          one verified reading trail.
        </p>
        <Suspense fallback={<p className="auth-page__copy">Loading sign in…</p>}>
          <SignIn />
        </Suspense>
      </div>
    </main>
  );
}
