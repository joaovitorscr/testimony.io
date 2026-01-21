import type { Metadata } from "next";
import { IBM_Plex_Mono, Lora, Plus_Jakarta_Sans } from "next/font/google";
import "../styles/globals.css";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env";
import { TRPCReactProvider } from "@/trpc/react";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const loraSerif = Lora({
  variable: "--font-lora-serif",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
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
        url: "/app-preview.png",
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
    images: ["/app-preview.png"],
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
        className={`${plusJakartaSans.variable} ${loraSerif.variable} ${ibmPlexMono.variable} dark antialiased`}
      >
        <TRPCReactProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
