import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "Testimonials",
  robots: { index: false, follow: false },
};

// Minimal root layout for the embeddable widget: no dashboard styles or auth,
// so the iframe stays light and inherits nothing from the app.
export default function EmbedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.className} style={{ margin: 0, background: "transparent" }}>
        {children}
      </body>
    </html>
  );
}
