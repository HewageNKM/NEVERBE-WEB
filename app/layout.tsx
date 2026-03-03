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
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

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
            <AntdRegistry>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#97e13e",
                    colorLink: "#5a9a1a",
                    colorLinkHover: "#97e13e",
                    colorLinkActive: "#4a8012",
                    colorInfo: "#97e13e",
                    colorSuccess: "#97e13e",
                    fontFamily: "var(--font-inter)",
                    borderRadius: 12,
                    colorBgLayout: "#f8faf5",
                    colorBgContainer: "#ffffff",
                    colorTextBase: "#1a1a1a",
                  },
                  components: {
                    Card: {
                      borderRadiusLG: 20,
                      paddingLG: 24,
                      colorBgContainer: "#ffffff",
                    },
                    Button: {
                      borderRadius: 99,
                      controlHeight: 44,
                      controlHeightLG: 56,
                      fontWeight: 700,
                      colorPrimary: "#97e13e",
                      colorPrimaryHover: "#7bc922",
                      primaryColor: "#ffffff",
                    },
                    Carousel: {
                      dotHeight: 6,
                      dotWidth: 32,
                      dotActiveWidth: 48,
                    },
                    Input: {
                      borderRadius: 99,
                      colorPrimary: "#97e13e",
                      colorPrimaryHover: "#97e13e",
                      activeBorderColor: "#97e13e",
                      hoverBorderColor: "#97e13e",
                    },
                    Select: {
                      borderRadius: 99,
                      colorPrimary: "#97e13e",
                    },
                    Tag: {
                      borderRadiusSM: 99,
                    },
                    Collapse: {
                      borderRadius: 12,
                    },
                    Drawer: {
                      borderRadius: 32,
                    },
                    Badge: {
                      colorPrimary: "#97e13e",
                    },
                  },
                }}
              >
                <main className="flex-1">{children}</main>
                <WebVitals />
              </ConfigProvider>
            </AntdRegistry>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
