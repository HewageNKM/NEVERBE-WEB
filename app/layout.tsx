import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "../style/globals.css";
import StoreProvider from "@/app/components/StoreProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import GlobalProvider from "@/app/components/GlobalProvider";
import { seoKeywords } from "@/constants";
import ReCaptchaProviderWrapper from "@/app/components/ReCaptchaProvider";


const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEVERBE",
  applicationName: "NEVERBE",
  viewport: "width=device-width, initial-scale=1",
  metadataBase: new URL("https://neverbe.lk"),
  alternates: {
    canonical: "https://neverbe.lk",
  },
  description:
    "NEVERBE is Sri Lanka's premier online store for high-quality Nike, adidas, New Balance and more copy shoes and accessories.",
  category: "Ecommerce",
  keywords: seoKeywords,
  twitter: {
    card: "summary_large_image",
    site: "@neverbe",
    creator: "@neverbe",
    title: "NEVERBE",
    description:
      "NEVERBE is Sri Lanka's premier online store for high-quality Nike, adidas, New Balance and more copy shoes and accessories.",
    images: [
      {
        url: "https://neverbe.lk/api/v1/og",
        alt: "NEVERBE Logo",
        width: 260,
        height: 260,
      },
    ],
  },
  openGraph: {
    url: "https://neverbe.lk",
    type: "website",
    locale: "en_US",
    siteName: "NEVERBE",
    title: "NEVERBE",
    description:
      "Discover NEVERBE is Sri Lanka's premier online store for high-quality Nike, adidas, New Balance and more copy shoes and accessories. with fast delivery and superior service.",
    images: [
      {
        url: "https://neverbe.lk/api/og",
        alt: "NEVERBE Logo",
        width: 260,
        height: 260,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://neverbe.lk",
      },
    ],
  };

  return (
    <html lang="en" className="scroll-smooth font-sans">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        <title></title>
      </head>
      <body className={roboto.className}>
        <ReCaptchaProviderWrapper>
          <StoreProvider>
            <GlobalProvider>{children}</GlobalProvider>
            <SpeedInsights />
            <Analytics />
          </StoreProvider>
        </ReCaptchaProviderWrapper>
      </body>
    </html>
  );
}
