import "./globals.css";
import type { Metadata } from "next";
import { Roboto_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { WebVitals } from "@/components/WebVitals";

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
  variable: "--font-mono",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

import StoreProvider from "@/app/(site)/components/StoreProvider";
import AuthProvider from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white text-neutral-900">
      <body
        className={`${mono.variable} ${inter.variable} ${plusJakartaSans.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <StoreProvider>
          <AuthProvider>
            <main className="flex-1">{children}</main>
            <WebVitals />
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
