import "./globals.css";
import type { Metadata } from "next";
import { Roboto_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { WebVitals } from "@/components/WebVitals";

export const metadata: Metadata = {
  title: {
    default: "NEVERBE — Buy Shoes Online in Sri Lanka | Sneakers & Footwear",
    template: "%s | NEVERBE",
  },
  description:
    "NEVERBE is Sri Lanka's #1 online shoe store. Shop sneakers, running shoes, slides, sandals & casual footwear. Cash on Delivery island-wide. Best prices guaranteed.",
  applicationName: "NEVERBE",
  keywords: [
    "NEVERBE",
    "shoes sri lanka",
    "buy shoes online",
    "sneakers sri lanka",
    "footwear sri lanka",
    "online shoe store",
    "mens shoes",
    "womens shoes",
    "running shoes",
    "casual shoes",
    "slides",
    "sandals",
    "cash on delivery shoes",
    "cheap shoes colombo",
    "best shoe shop sri lanka",
  ],
  authors: [{ name: "NEVERBE" }],
  creator: "NEVERBE",
  publisher: "NEVERBE",
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://neverbe.lk"),
  alternates: {
    canonical: "https://neverbe.lk",
  },
  openGraph: {
    title: "NEVERBE — Buy Shoes Online in Sri Lanka",
    description:
      "Sri Lanka's largest online shoe collection. Shop sneakers, running shoes, slides & sandals. Cash on Delivery available island-wide.",
    siteName: "NEVERBE",
    url: "https://neverbe.lk",
    locale: "en_LK",
    type: "website",
    images: [
      {
        url: "/logo-og.png",
        width: 1200,
        height: 630,
        alt: "NEVERBE - Online Shoe Store Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEVERBE — Buy Shoes Online in Sri Lanka",
    description:
      "Shop sneakers, running shoes & footwear online. Cash on Delivery island-wide.",
    images: ["/logo-og.png"],
    creator: "@neverbe_lk",
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual code
  },
  category: "ecommerce",
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
