import type { Metadata } from "next";
import PrivateHeader from "@/components/layout/private-header";

export const metadata: Metadata = {
  title: "Testimony.io | Dashboard",
  description:
    "Collect testimonials from your customers and display them on your website.",
};

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PrivateHeader />
      {children}
    </>
  );
}
