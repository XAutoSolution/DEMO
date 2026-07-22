import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Demo",
  // Every demo route stays out of search indexes and never cross-links.
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
