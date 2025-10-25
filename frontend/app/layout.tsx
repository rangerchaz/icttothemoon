import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wichita to the Moon",
  description: "An AI-powered moon colonization game featuring Wichita landmarks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
