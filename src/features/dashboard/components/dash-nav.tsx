"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  Bookmark,
  Clock,
  Download,
  Flame,
  Headphones,
  HeartHandshake,
  HelpCircle,
  Home,
  LayoutGrid,
  LogOut,
  MessageSquare,
  PenSquare,
  ShieldCheck,
  Settings,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

const groups: NavItem[][] = [
  [
    { href: "/dashboard", label: "Home", icon: Home, exact: true },
    { href: "/dashboard/community", label: "Community", icon: HeartHandshake },
    { href: "/dashboard/audio", label: "Audio Books", icon: Headphones },
    { href: "/dashboard/saved", label: "Saved", icon: Bookmark },
    { href: "/dashboard/history", label: "Read History", icon: Clock },
    { href: "/dashboard/downloaded", label: "Downloaded", icon: Download },
  ],
  [
    { href: "/dashboard/trending", label: "Now Trending", icon: Flame },
    { href: "/dashboard/topics", label: "Categories", icon: LayoutGrid },
    { href: "/dashboard/following", label: "Following", icon: Users },
  ],
  [
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/dashboard/help", label: "Help", icon: HelpCircle },
    { href: "/dashboard/feedback", label: "Send Feedback", icon: MessageSquare },
  ],
];

export function DashNav({
  showEditor,
  showModerate,
}: {
  showEditor: boolean;
  showModerate: boolean;
}) {
  const pathname = usePathname();
  const staff: NavItem[] = [
    ...(showModerate
      ? [{ href: "/dashboard/community/moderate", label: "Moderate", icon: ShieldCheck }]
      : []),
    ...(showEditor ? [{ href: "/editor", label: "Editor", icon: PenSquare }] : []),
  ];
  const allGroups = staff.length ? [...groups, staff] : groups;

  return (
    <nav className="dash-nav" aria-label="Dashboard">
      {allGroups.map((items, index) => (
        <div className="dash-nav__group" key={index}>
          {items.map((item) => {
            const active = item.exact
              ? pathname === item.href ||
                pathname.startsWith("/dashboard/articles")
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dash-nav__link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="dash-icon" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function DashBrand() {
  return (
    <Link className="dash-brand" href="/" aria-label="KalevaShorts home">
      <svg className="dash-brand__mark" viewBox="0 0 40 28" aria-hidden="true">
        <path
          className="dash-brand__mark-a"
          d="M3 19C10 5 17 5 21 14s11 9 16-6"
        />
        <path
          className="dash-brand__mark-b"
          d="M3 10c7 13 14 13 18 4s11-10 16 5"
        />
      </svg>
      <span className="dash-brand__word">KalevaShorts</span>
    </Link>
  );
}

export function DashSignOut() {
  const { signOut } = useClerk();

  return (
    <button
      className="dash-signout"
      type="button"
      onClick={() => void signOut({ redirectUrl: "/" })}
    >
      <LogOut className="dash-icon" aria-hidden="true" />
      <span>Sign out</span>
    </button>
  );
}
