"use client";

import { useClerk } from "@clerk/nextjs";

export function SignOutControl() {
  const { signOut } = useClerk();

  return (
    <button
      className="workspace__button"
      type="button"
      onClick={() => signOut({ redirectUrl: "/" })}
    >
      Sign out
    </button>
  );
}
