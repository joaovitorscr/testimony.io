import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials",
  robots: { index: false, follow: false },
};

// Minimal root layout for the embeddable widget: no dashboard styles, fonts,
// or auth, so the iframe stays light and inherits nothing from the app.
export default function EmbedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "transparent" }}>{children}</body>
    </html>
  );
}
