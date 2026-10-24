import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import "@/styles/landing.css";
import "@/styles/workspace.css";
import "@/styles/dashboard.css";

const siteDescription =
  "KalevaShorts is a multilingual news intelligence platform. It gathers reporting in Finnish, English and Swedish, organises it in a topic tree, and is being built so agents can compare accounts across languages and keep the evidence behind every claim.";

export const metadata: Metadata = {
  title: {
    default: "KalevaShorts — Multilingual news intelligence",
    template: "%s · KalevaShorts",
  },
  description: siteDescription,
  applicationName: "KalevaShorts",
  openGraph: {
    type: "website",
    title: "KalevaShorts — Multilingual news intelligence",
    description: siteDescription,
    siteName: "KalevaShorts",
    images: [
      {
        url: "https://images.unsplash.com/photo-1719492172750-4ca0809345b8?auto=format&fit=crop&w=1600&q=80",
        width: 1600,
        height: 1200,
        alt: "A reader following a bilingual Finnish–English news story on a phone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KalevaShorts — Multilingual news intelligence",
    description: siteDescription,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="m-text">
        {/* Clerk 7 configures the post-sign-out destination on signOut({ redirectUrl }) and through the Clerk dashboard rather than the removed afterSignOutUrl prop. */}
        <ClerkProvider
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
