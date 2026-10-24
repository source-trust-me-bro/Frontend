"use client";

import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";

type LandingCtaProps = {
  className: string;
  label: string;
  href?: string;
};

export function LandingCta({
  className,
  label,
  href = "/dashboard",
}: LandingCtaProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { openSignUp } = useClerk();

  return (
    <Link
      className={className}
      href={isLoaded && isSignedIn ? href : "/sign-up"}
      onClick={(event) => {
        if (!isLoaded || isSignedIn) return;

        event.preventDefault();
        openSignUp();
      }}
    >
      <span className="m-btn__label">{label}</span>
      <span className="m-btn__wave" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
      </span>
    </Link>
  );
}
