import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import "@/styles/landing.css";
import "@/styles/workspace.css";

const siteDescription =
  "KalevaShorts is an open-source bilingual Finnish–English news platform that ingests Finnish and English reporting, links every claim to its source, and gives communities a verifiable cross-language reading experience.";

export const metadata: Metadata = {
  title: {
    default: "KalevaShorts — Verified news in Finnish and English",
    template: "%s · KalevaShorts",
  },
  description: siteDescription,
  generator: "8B Templates",
  applicationName: "KalevaShorts",
  openGraph: {
    type: "website",
    title: "KalevaShorts — Verified news in Finnish and English",
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
    title: "KalevaShorts — Verified news in Finnish and English",
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
