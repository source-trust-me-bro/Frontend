import { Suspense } from "react";

import {
  DashboardShell,
  DashboardSkeleton,
} from "@/features/dashboard/components/dashboard-shell";

/**
 * The sidebar, the user card and the right-hand panel live here, once. Moving between dashboard
 * pages swaps only the content in the middle: the chrome is not rendered again and its data
 * (profile, member, Clerk user, trending picks) is not fetched again on every click.
 */
export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
