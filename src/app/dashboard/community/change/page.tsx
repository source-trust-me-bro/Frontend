import { redirect } from "next/navigation";

export const instant = false;

/** There is no single community to change any more: members follow as many as they like. */
export default function ChangeCommunityPage() {
  redirect("/dashboard/community?tab=discover");
}
