import { getMember } from "@/features/news/server/data";

import { NewsroomDesk } from "./newsroom-desk";

/** The editor's desk: review as editor-in-chief. Trusted voices live in the side panel. */
export async function EditorDesk() {
  const member = await getMember().catch(() => null);
  const roles = member?.review_roles ?? [];

  return (
    <NewsroomDesk
      allowedRoles={["editor_in_chief", ...roles]}
      isEditor
      memberCommunityId={member?.community_id ?? null}
    />
  );
}
