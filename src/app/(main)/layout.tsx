import type { Metadata } from "next";
import { EB_Garamond, Geist, IBM_Plex_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "@/styles/globals.css";

import { Suspense } from "react";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { env } from "@/env";
import { ConvexAuthNextjsServerProvider } from "@/lib/convex-auth";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const siteUrl = env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: {
    default: "Testimony.io - Collect & Display Customer Testimonials",
    template: "%s | Testimony.io",
  },
  description:
    "Collect powerful testimonials from your customers and display them beautifully on your website. Boost trust, increase conversions, and grow your business with social proof.",
  keywords: [
    "testimonials",
    "customer reviews",
    "social proof",
    "customer feedback",
    "review collection",
    "testimonial widget",
    "customer testimonials",
    "review management",
    "website testimonials",
    "trust badges",
  ],
  authors: [{ name: "Testimony.io" }],
  creator: "Testimony.io",
  publisher: "Testimony.io",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Testimony.io",
    title: "Testimony.io - Collect & Display Customer Testimonials",
    description:
      "Collect powerful testimonials from your customers and display them beautifully on your website. Boost trust, increase conversions, and grow your business with social proof.",
    images: [
      {
        url: "/app_preview.png",
        width: 1200,
        height: 630,
        alt: "Testimony.io - Customer Testimonial Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Testimony.io - Collect & Display Customer Testimonials",
    description:
      "Collect powerful testimonials from your customers and display them beautifully on your website. Boost trust and grow your business with social proof.",
    images: ["/app_preview.png"],
    creator: "@testimonyio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${ibmPlexMono.variable} ${ebGaramond.variable} antialiased`}
      >
        <Suspense>
          <ConvexAuthNextjsServerProvider>
            <NuqsAdapter>
              <TooltipProvider>{children}</TooltipProvider>
            </NuqsAdapter>
          </ConvexAuthNextjsServerProvider>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
