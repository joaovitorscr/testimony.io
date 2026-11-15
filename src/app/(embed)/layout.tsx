import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials",
  robots: { index: false, follow: false },
};

// Minimal root layout for the embeddable widget: no dashboard styles, fonts,
// or auth, so the iframe stays light and inherits nothing from the app.
export default function EmbedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          background: "transparent",
        }}
      >
        {children}
      </body>
    </html>
  );
}
