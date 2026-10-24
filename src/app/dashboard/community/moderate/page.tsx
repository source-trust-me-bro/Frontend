import type { Metadata } from "next";

import { AppointModeratorForm } from "@/features/community/components/appoint-moderator-form";
import { NewsroomDesk } from "@/features/community/components/newsroom-desk";
import { ErrorPanel } from "@/features/dashboard/components/dashboard-shell";
import { ViewHeader } from "@/features/dashboard/components/views";
import { canEdit } from "@/features/news/schemas";
import { attempt, getProfile } from "@/features/news/server/api";
import { getCommunities, getMember } from "@/features/news/server/data";

export const metadata: Metadata = {
  title: "Moderate",
  description: "Review stories for your community.",
};

export const instant = false;

export default function ModeratePage() {
  return (
    <Moderate />
  );
}

async function Moderate() {
  const result = await attempt(async () => {
    const [profile, member, communities] = await Promise.all([
      getProfile(),
      getMember(),
      getCommunities(),
    ]);

    return { profile, member, communities };
  });

  if (!result.ok) {
    return <ErrorPanel message={result.message} />;
  }

  const { profile, member, communities } = result.data;
  const editor = canEdit(profile);
  const moderator =
    member.community_role === "moderator" || member.community_role === "admin";

  if (!editor && !moderator) {
    return (
      <div className="dash-empty">
        <h2>This page is for community moderators</h2>
        <p>
          Moderators and admins are the people who run a community. If you would like to help,
          tell us through the feedback form.
        </p>
      </div>
    );
  }

  const community = communities.find((item) => item.id === member.community_id);

  return (
    <div className="dash-view">
      <ViewHeader
        title="Moderate"
        sub={
          community
            ? `Review stories for ${community.name}. You are one of its trusted voices.`
            : "Review stories for your community."
        }
      />
      <NewsroomDesk
        title="Stories waiting for you"
        isEditor={editor}
        memberCommunityId={member.community_id ?? null}
        allowedRoles={[...(editor ? ["editor_in_chief"] : []), ...member.review_roles]}
      />
      {member.community_role === "admin" && community ? (
        <AppointModeratorForm
          canAppointAdmins={false}
          languages={community.languages.map((lane) => ({ code: lane.code, label: lane.label }))}
        />
      ) : null}
    </div>
  );
}
