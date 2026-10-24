import Link from "next/link";

import { SignOutControl } from "./sign-out-control";

export function WorkspaceHeader({
  active,
}: {
  active: "dashboard" | "editor";
}) {
  return (
    <header className="workspace__topbar">
      <Link className="workspace__brand" href="/">
        <svg className="workspace__mark" viewBox="0 0 40 28" aria-hidden="true">
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
      <div className="workspace__topbar-actions">
        <Link className="workspace__nav-link" href="/">
          Landing page
        </Link>
        <Link className="workspace__nav-link" href="/dashboard">
          {active === "dashboard" ? "Dashboard" : "Reader dashboard"}
        </Link>
        {active === "editor" ? (
          <span className="workspace__nav-link">Editor</span>
        ) : (
          <Link className="workspace__nav-link" href="/editor">
            Editor
          </Link>
        )}
        <SignOutControl />
      </div>
    </header>
  );
}
