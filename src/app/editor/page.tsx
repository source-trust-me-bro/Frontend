import type { Metadata } from "next";
import { Suspense } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { WorkspaceHeader } from "@/features/users/components/workspace-header";

export const metadata: Metadata = {
  title: "Editor",
  description:
    "Role-verified KalevaShorts editor workspace for community curation.",
};

export const instant = false;

export default function EditorPage() {
  return (
    <main className="workspace">
      <div className="workspace__shell">
        <WorkspaceHeader active="editor" />
        <Suspense fallback={<EditorSkeleton />}>
          <EditorGate />
        </Suspense>
      </div>
    </main>
  );
}

async function EditorGate() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let role = sessionClaims?.metadata?.role;

  if (!role) {
    const user = await currentUser().catch(() => null);
    role = (
      user?.publicMetadata as
        | { role?: "viewer" | "editor" | "admin" }
        | undefined
    )?.role;
  }

  if (role !== "editor" && role !== "admin") {
    return <EditorDenied role={role ?? "viewer"} />;
  }

  return <EditorWorkspace role={role} />;
}

function EditorWorkspace({ role }: { role: "editor" | "admin" }) {
  return (
    <>
      <div className="workspace__header">
        <p className="workspace__eyebrow">Phase 1 · Editor workspace</p>
        <h1 className="workspace__title">
          Curate the picture, not the noise.
        </h1>
        <p className="workspace__lead">
          Your <strong>{role}</strong> role was verified on the server before
          this workspace rendered. Topic trees, source review and language
          coverage all run against the same FastAPI profile.
        </p>
      </div>

      <div className="workspace__editor-grid">
        <section className="workspace__panel">
          <div className="workspace__panel-head">
            <h2 className="workspace__panel-title">Topic tree</h2>
            <span className="workspace__badge">Draft</span>
          </div>
          <div className="workspace__list">
            <div className="workspace__topic">
              <strong>Local · Helsinki</strong>
              <span>Municipal budgets · 6 stories · 2 languages</span>
            </div>
            <div className="workspace__topic">
              <strong>Nordic · Stockholm</strong>
              <span>Committee reviews · 4 stories · 2 languages</span>
            </div>
            <div className="workspace__topic">
              <strong>Europe · Brussels</strong>
              <span>Policy proposals · 5 stories · 2 languages</span>
            </div>
            <div className="workspace__topic">
              <strong>Science · Tampere</strong>
              <span>Peer review · 3 stories · 2 languages</span>
            </div>
          </div>
          <p className="workspace__panel-note">
            Editor actions are read-only in Phase 1. The topic API lands with
            the Phase 2 ingestion service.
          </p>
        </section>

        <div className="workspace__list">
          <section className="workspace__panel">
            <div className="workspace__panel-head">
              <h2 className="workspace__panel-title">
                Source review queue
              </h2>
              <span className="workspace__badge workspace__badge--warning">
                3 awaiting review
              </span>
            </div>
            <div className="workspace__list">
              <div className="workspace__list-item">
                <strong>Municipal budget vote count</strong>
                <span>
                  Confirmed by two regional outlets · English, Suomi
                </span>
              </div>
              <div className="workspace__list-item">
                <strong>Committee review timeline</strong>
                <span>
                  Single source · Suomi translation pending
                </span>
              </div>
              <div className="workspace__list-item">
                <strong>Peer review status</strong>
                <span>
                  Original study linked · English, Suomi
                </span>
              </div>
            </div>
          </section>

          <section className="workspace__panel workspace__panel--dark">
            <div className="workspace__panel-head">
              <h2 className="workspace__panel-title">
                Language coverage
              </h2>
              <span className="workspace__panel-note">
                Last 30 days
              </span>
            </div>
            <div className="workspace__coverage">
              <div className="workspace__coverage-row">
                <span>English</span>
                <span className="workspace__coverage-bar">
                  <span style={{ width: "94%" }}></span>
                </span>
                <span className="workspace__coverage-value">94%</span>
              </div>
              <div className="workspace__coverage-row">
                <span>Suomi</span>
                <span className="workspace__coverage-bar">
                  <span style={{ width: "88%" }}></span>
                </span>
                <span className="workspace__coverage-value">88%</span>
              </div>
            </div>
            <p className="workspace__panel-note">
              Coverage is measured against the shared source set, not
              engagement.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

function EditorDenied({ role }: { role: string }) {
  return (
    <>
      <div className="workspace__header">
        <p className="workspace__eyebrow">Editor workspace</p>
        <h1 className="workspace__title">Editor access required.</h1>
        <p className="workspace__lead">
          The server checked your Clerk session for an <strong>editor</strong>{" "}
          or <strong>admin</strong> role and found <strong>{role}</strong>.
          Editor controls were not rendered.
        </p>
      </div>
      <section className="workspace__panel workspace__panel--span-12">
        <div className="workspace__panel-head">
          <h2 className="workspace__panel-title">
            How role access works
          </h2>
          <span className="workspace__badge workspace__badge--danger">
            Not authorised
          </span>
        </div>
        <div className="workspace__list">
          <div className="workspace__list-item">
            <strong>Roles come from Clerk</strong>
            <span>
              An administrator sets <code>metadata.role</code> to{" "}
              <code>editor</code> or <code>admin</code> on your Clerk user.
            </span>
          </div>
          <div className="workspace__list-item">
            <strong>The server verifies every render</strong>
            <span>
              This page reads the session claims, then re-checks public
              metadata before rendering any editor surface.
            </span>
          </div>
        </div>
        <div className="workspace__actions">
          <Link className="workspace__nav-link" href="/dashboard">
            Back to dashboard
          </Link>
          <Link className="workspace__nav-link" href="/#contact">
            Request access
          </Link>
        </div>
      </section>
    </>
  );
}

function EditorSkeleton() {
  return (
    <div className="workspace__skeleton" aria-hidden="true">
      <div className="workspace__skeleton-bar"></div>
      <div className="workspace__skeleton-bar"></div>
    </div>
  );
}
