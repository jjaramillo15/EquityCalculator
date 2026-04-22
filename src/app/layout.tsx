import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Texas Hold'em Equity Calculator",
  description:
    "Review multiway Hold'em spots with saved ranges, scenario history, and fast equity estimates.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-felt-950 text-stone-50 antialiased">
        {children}
      </body>
    </html>
  );
}
