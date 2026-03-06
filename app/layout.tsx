import "./globals.css";
import type { Metadata } from "next";
import { Roboto_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { WebVitals } from "@/components/WebVitals";

export const metadata: Metadata = {
  title: {
    default:
      "NEVERBE — Premium Footwear & Apparel in Sri Lanka | Sneakers & Clothing",
    template: "%s | NEVERBE",
  },
  description:
    "NEVERBE is Sri Lanka's premier destination for high-end footwear and apparel. Explore our curated collection of sneakers, premium clothing, and high-performance wearables. Island-wide delivery & COD.",
  applicationName: "NEVERBE",
  keywords: [
    "NEVERBE",
    "premium footwear sri lanka",
    "buy sneakers online colombo",
    "branded clothing sri lanka",
    "mens premium fashion",
    "womens high-end apparel",
    "luxury wearables sri lanka",
    "running gear colombo",
    "online clothing store sri lanka",
    "best sneakers shop sri lanka",
    "curated fashion colombo",
    "exclusive footwear sri lanka",
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
    title: "NEVERBE — Premium Footwear & Apparel Online",
    description:
      "Experience premium fashion in Sri Lanka. Shop our exclusive collection of sneakers, luxury clothing, and high-performance wearables.",
    siteName: "NEVERBE",
    url: "https://neverbe.lk",
    locale: "en_LK",
    type: "website",
    images: [
      {
        url: "/logo-og.png",
        width: 1200,
        height: 630,
        alt: "NEVERBE - Premium Footwear & Apparel Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEVERBE — High-End Footwear & Clothing Online",
    description:
      "Discover the finest selection of sneakers and premium apparel in Sri Lanka. COD available island-wide.",
    images: ["/logo-og.png"],
    creator: "@neverbe_lk",
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual code
  },
  category: "retail",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NEVERBE",
    url: "https://neverbe.lk",
    logo: "https://neverbe.lk/logo.png",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+94729249999",
        contactType: "customer service",
        areaServed: "LK",
        availableLanguage: "English",
      },
      {
        "@type": "ContactPoint",
        telephone: "+94705208999",
        contactType: "sales",
        areaServed: "LK",
        availableLanguage: "English",
      },
    ],
    sameAs: [
      "https://www.facebook.com/share/1GaP5gJB2p/",
      "https://www.instagram.com/neverbe.196",
      "https://www.tiktok.com/@neverbe196",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "330/4/10, New Kandy Road",
      addressLocality: "Delgoda",
      addressRegion: "Gampaha",
      addressCountry: "LK",
    },
  };

  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "NEVERBE",
    image: "https://neverbe.lk/logo-og.png",
    "@id": "https://neverbe.lk",
    url: "https://neverbe.lk",
    telephone: "+94729249999",
    address: {
      "@type": "PostalAddress",
      streetAddress: "330/4/10, New Kandy Road",
      addressLocality: "Delgoda",
      addressRegion: "Gampaha",
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.9869,
      longitude: 80.0127,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  };

  return (
    <html lang="en" className="bg-white text-primary">
      <body
        className={`${mono.variable} ${inter.variable} ${plusJakartaSans.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
        />
        <StoreProvider>
          <AuthProvider>
            <AntdRegistry>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "var(--color-accent)",
                    colorLink: "var(--color-accent)",
                    colorLinkHover: "var(--color-accent)",
                    colorLinkActive: "var(--color-accent-hover)",
                    colorInfo: "var(--color-accent)",
                    colorSuccess: "var(--color-accent)",
                    fontFamily: "var(--font-inter)",
                    borderRadius: 12,
                    colorBgLayout: "#f8faf5",
                    colorBgContainer: "#ffffff",
                    colorTextBase: "var(--color-primary)",
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
                      colorPrimary: "var(--color-accent)",
                      colorPrimaryHover: "var(--color-accent-hover)",
                      primaryColor: "#ffffff",
                    },
                    Carousel: {
                      dotHeight: 6,
                      dotWidth: 32,
                      dotActiveWidth: 48,
                    },
                    Input: {
                      borderRadius: 99,
                      colorPrimary: "var(--color-accent)",
                      colorPrimaryHover: "var(--color-accent)",
                      activeBorderColor: "var(--color-accent)",
                      hoverBorderColor: "var(--color-accent)",
                    },
                    Select: {
                      borderRadius: 99,
                      colorPrimary: "var(--color-accent)",
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
                      colorPrimary: "var(--color-accent)",
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
