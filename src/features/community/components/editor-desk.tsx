import { attempt, getProfile } from "@/features/news/server/api";
import { getCommunities, getMember } from "@/features/news/server/data";

import { AppointModeratorForm } from "./appoint-moderator-form";
import { NewsroomDesk } from "./newsroom-desk";

/** The editor's desk: review as editor-in-chief, and appoint the community's trusted voices. */
export async function EditorDesk() {
  const result = await attempt(async () => {
    const [profile, member, communities] = await Promise.all([
      getProfile(),
      getMember().catch(() => null),
      getCommunities().catch(() => []),
    ]);

    return { profile, member, communities };
  });

  const roles = result.ok ? (result.data.member?.review_roles ?? []) : [];

  return (
    <>
      <NewsroomDesk
        allowedRoles={["editor_in_chief", ...roles]}
        isEditor
        memberCommunityId={result.ok ? (result.data.member?.community_id ?? null) : null}
      />
      {result.ok ? (
        <AppointModeratorForm
          canAppointAdmins
          communities={result.data.communities.map((c) => ({ id: c.id, name: c.name }))}
          languages={Array.from(
            new Map(
              result.data.communities
                .flatMap((c) => c.languages)
                .map((lane) => [lane.code, { code: lane.code, label: lane.label }]),
            ).values(),
          )}
        />
      ) : null}
    </>
  );
}
