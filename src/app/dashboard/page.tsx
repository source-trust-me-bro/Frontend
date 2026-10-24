import type { Metadata } from "next";
import { Suspense } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { HealthStatusCard } from "@/features/system-health/components/health-status-card";
import { PreferencesForm } from "@/features/users/components/preferences-form";
import { UserProfileCard } from "@/features/users/components/user-profile-card";
import { WorkspaceHeader } from "@/features/users/components/workspace-header";
import { getCurrentUserProfile } from "@/features/users/server/get-current-user-profile";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your Clerk-authenticated KalevaShorts workspace, synced with the FastAPI user profile.",
};

export const instant = false;

export default function DashboardPage() {
  return (
    <main className="workspace">
      <div className="workspace__shell">
        <WorkspaceHeader active="dashboard" />
        <Suspense fallback={<WorkspaceSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </main>
  );
}

async function DashboardContent() {
  const { userId, getToken, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const token = await getToken();
  const [user, profileResult] = await Promise.all([
    currentUser().catch(() => null),
    getCurrentUserProfile(token),
  ]);

  const profile = profileResult.status === "ok" ? profileResult.profile : null;
  const role =
    sessionClaims?.metadata?.role ?? profile?.role ?? "viewer";
  const canEdit = role === "editor" || role === "admin";
  const displayName =
    user?.fullName ||
    user?.username ||
    profile?.display_name ||
    "Reader";
  const email =
    user?.primaryEmailAddress?.emailAddress ?? profile?.email ?? null;

  return (
    <>
      <div className="workspace__header">
        <p className="workspace__eyebrow">
          Phase 1 · Reader workspace
        </p>
        <h1 className="workspace__title">
          Welcome back, {displayName}.
        </h1>
        <p className="workspace__lead">
          Your Clerk session is active and your language preferences are
          stored on the FastAPI profile. Pick a lead language, check the
          backend, then open the editor if your role allows it.
        </p>
      </div>

      <div className="workspace__grid">
        {profileResult.status === "ok" ? (
          <>
            <UserProfileCard
              profile={profileResult.profile}
              name={displayName}
              email={email}
              role={role}
            />
            <PreferencesForm
              currentLanguage={profileResult.profile.preferred_language}
            />
          </>
        ) : (
          <section className="workspace__panel workspace__panel--span-12">
            <div className="workspace__panel-head">
              <h2 className="workspace__panel-title">
                FastAPI profile sync
              </h2>
              <span className="workspace__badge workspace__badge--warning">
                {profileResult.status === "missing"
                  ? "Awaiting first sync"
                  : "Needs attention"}
              </span>
            </div>
            <div className="workspace__empty">
              <p>{profileResult.message}</p>
              <p>
                The dashboard keeps your Clerk identity available while the
                API is offline. Once{" "}
                <code>GET /api/v1/users/me</code> responds, the MongoDB
                profile and language settings appear here.
              </p>
            </div>
            <dl className="workspace__facts">
              <div className="workspace__fact">
                <dt>Signed in as</dt>
                <dd>{displayName}</dd>
              </div>
              <div className="workspace__fact">
                <dt>Email</dt>
                <dd>{email || "not provided"}</dd>
              </div>
              <div className="workspace__fact">
                <dt>Role</dt>
                <dd>{role}</dd>
              </div>
              <div className="workspace__fact">
                <dt>Clerk user</dt>
                <dd>{userId.slice(0, 12)}…</dd>
              </div>
            </dl>
          </section>
        )}

        <HealthStatusCard />

        <section className="workspace__panel workspace__panel--span-8">
          <div className="workspace__panel-head">
            <h2 className="workspace__panel-title">
              {canEdit ? "Editor workspace unlocked" : "What you can do now"}
            </h2>
            <span
              className={
                canEdit
                  ? "workspace__badge"
                  : "workspace__badge workspace__badge--neutral"
              }
            >
              Role · {role}
            </span>
          </div>
          <div className="workspace__list">
            <div className="workspace__list-item">
              <strong>Read across languages</strong>
              <span>
                Follow Finnish and English reporting with the original
                source kept beside every translation.
              </span>
            </div>
            <div className="workspace__list-item">
              <strong>Keep one verified trail</strong>
              <span>
                Saved stories keep their outlets, revisions and language
                versions together.
              </span>
            </div>
            <div className="workspace__list-item">
              <strong>
                {canEdit
                  ? "Curate topics and sources"
                  : "Apply for Community Editor"}
              </strong>
              <span>
                {canEdit
                  ? "Your editor or admin role was verified on the server. Open the editor workspace to review coverage."
                  : "Editor access is granted through Clerk role metadata and verified again on the server before any controls render."}
              </span>
            </div>
          </div>
          <div className="workspace__actions">
            <Link
              className="workspace__nav-link"
              href={canEdit ? "/editor" : "/#contact"}
            >
              {canEdit ? "Open editor workspace" : "Request editor access"}
            </Link>
            <Link className="workspace__nav-link" href="/#listen">
              How verification works
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

function WorkspaceSkeleton() {
  return (
    <div className="workspace__skeleton" aria-hidden="true">
      <div className="workspace__skeleton-bar"></div>
      <div className="workspace__skeleton-bar"></div>
      <div className="workspace__skeleton-bar"></div>
    </div>
  );
}
