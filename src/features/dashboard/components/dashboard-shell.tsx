import { Suspense } from "react";
import type { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";

import { canEdit } from "@/features/news/schemas";
import { attempt, getProfile, requireUserId } from "@/features/news/server/api";
import { getMember } from "@/features/news/server/data";

import { DashAside } from "./dash-aside";
import { DashBrand, DashNav, DashSignOut } from "./dash-nav";

export function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="dash-error" role="alert">
      <h2>We could not load this page</h2>
      <p>{message}</p>
    </div>
  );
}

export function DashboardSkeleton({ showAside = true }: { showAside?: boolean }) {
  return (
    <div className="dash-page">
      <div
        className={`dash-app${showAside ? "" : " dash-app--no-aside"}`}
        aria-hidden="true"
      >
        <div className="dash-skeleton dash-skeleton--sidebar"></div>
        <div className="dash-skeleton dash-skeleton--main"></div>
        {showAside ? <div className="dash-skeleton dash-skeleton--aside"></div> : null}
      </div>
    </div>
  );
}

/** Verifies the Clerk session, loads the FastAPI profile and renders the chrome. */
export async function DashboardShell({
  children,
  showAside = true,
  wide = false,
  aside,
}: {
  children: ReactNode;
  showAside?: boolean;
  wide?: boolean;
  aside?: ReactNode;
}) {
  await requireUserId();

  // Three independent lookups: run them side by side instead of one after another.
  const [result, member, clerkUser] = await Promise.all([
    attempt(getProfile),
    getMember().catch(() => null),
    currentUser().catch(() => null),
  ]);

  if (!result.ok) {
    return (
      <div className="dash-page">
        <div className="dash-main dash-main--solo">
          <ErrorPanel message={result.message} />
        </div>
      </div>
    );
  }

  const profile = result.data;
  const hasAside = showAside || Boolean(aside);
  const appClass = `dash-app${hasAside ? "" : " dash-app--no-aside"}${
    aside ? " dash-app--custom-aside" : ""
  }`;

  const showModerate =
    member?.community_role === "moderator" || member?.community_role === "admin";
  const name =
    profile.display_name ||
    clerkUser?.fullName ||
    clerkUser?.username ||
    "Reader";
  const role = profile.roles.includes("admin")
    ? "Admin"
    : profile.roles.includes("editor")
      ? "Editor"
      : "Reader";

  return (
    <div className="dash-page">
      <div className={appClass}>
        <aside className="dash-sidebar">
          <DashBrand />
          <div className="dash-user">
            {clerkUser?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="dash-user__avatar"
                src={clerkUser.imageUrl}
                alt=""
                width={34}
                height={34}
              />
            ) : (
              <span className="dash-user__avatar dash-user__avatar--initial">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="dash-user__meta">
              <span className="dash-user__name">{name}</span>
            </div>
            <span className="dash-user__role">{role}</span>
          </div>
          <DashNav showEditor={canEdit(profile)} showModerate={showModerate} />
          <DashSignOut />
        </aside>
        <main className="dash-main">
          <div className="dash-body">
            <div
              className={`dash-body__inner${wide ? " dash-body__inner--wide" : ""}`}
            >
              {children}
            </div>
          </div>
        </main>
        {hasAside ? (
          <Suspense fallback={null}>{aside ?? <DashAside />}</Suspense>
        ) : null}
      </div>
    </div>
  );
}
