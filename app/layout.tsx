import "./globals.css";
import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: {
    default: "NEVERBE — Shoes in Sri Lanka",
    template: "%s | NEVERBE",
  },
  description:
    "NEVERBE — The largest online shoe store in Sri Lanka. Sneakers, casual shoes, running shoes and more. Cash on Delivery island-wide.",
  applicationName: "NEVERBE",
  keywords: ["NEVERBE", "shoes", "sri lanka", "online shoe store"],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "NEVERBE — Shoes in Sri Lanka",
    siteName: "NEVERBE",
    url: "https://neverbe.lk",
    images: ["https://neverbe.lk/api/v1/og"],
    type: "website",
  },
};

const mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white text-neutral-900">
      <body
        className={`${mono.className} antialiased min-h-screen flex flex-col`}
      >
        <main className="flex-1 animate-fade">{children}</main>
      </body>
    </html>
  );
}
