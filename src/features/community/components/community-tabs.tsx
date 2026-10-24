import Link from "next/link";

export type CommunityTab = "following" | "discover" | "participate";

const tabs: { id: CommunityTab; label: string; href: string }[] = [
  { id: "following", label: "Following", href: "/dashboard/community" },
  { id: "discover", label: "Discover", href: "/dashboard/community?tab=discover" },
  { id: "participate", label: "Take part", href: "/dashboard/community?tab=participate" },
];

export function parseTab(value: string | string[] | undefined): CommunityTab {
  const tab = Array.isArray(value) ? value[0] : value;

  if (tab === "discover") {
    return "discover";
  }

  // "community" was the old single-community tab; it is now where people take part.
  return tab === "participate" || tab === "community" ? "participate" : "following";
}

export function CommunityTabs({ active }: { active: CommunityTab }) {
  return (
    <div className="dash-tabs" role="tablist" aria-label="Community">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          className={`dash-tab${tab.id === active ? " is-active" : ""}`}
          href={tab.href}
          role="tab"
          aria-selected={tab.id === active}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
