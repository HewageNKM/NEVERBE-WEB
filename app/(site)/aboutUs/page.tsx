import React from "react";
import type { Metadata } from "next";
import AboutUsClient from "./components/AboutUsClient";

export const metadata: Metadata = {
  title: "About Us - NEVERBE | Sri Lanka's #1 Shoe & Clothing Store",
  description:
    "Learn about NEVERBE, Sri Lanka's trusted destination for premium shoes, clothing & apparel. Discover our mission, vision, and commitment to style, quality, and affordability.",
  keywords:
    "NEVERBE, about us, shoes sri lanka, clothing sri lanka, premium footwear, apparel online, sneakers, online shoe and clothing store sri lanka",
  alternates: {
    canonical: "https://neverbe.lk/aboutUs",
  },
  openGraph: {
    title: "About NEVERBE - Sri Lanka's Trusted Shoe & Clothing Store",
    description:
      "Learn about NEVERBE, Sri Lanka's trusted destination for premium shoes, clothing & apparel. Style, quality, and affordability.",
    url: "https://neverbe.lk/aboutUs",
    siteName: "NEVERBE",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "/main-og.png",
        width: 1200,
        height: 630,
        alt: "NEVERBE - Shoes & Clothing Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@neverbe",
    creator: "@neverbe",
    title: "About NEVERBE - Sri Lanka's Trusted Shoe & Clothing Store",
    description:
      "Learn about NEVERBE, Sri Lanka's trusted destination for premium shoes & clothing.",
    images: ["/main-og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

const AboutUs = () => {
  /* ✅ Structured Data for AboutPage + Organization */
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "NEVERBE",
        url: "https://neverbe.lk",
        logo: "/main-og.png",
        sameAs: [
          "https://www.facebook.com/neverbe196",
          "https://www.instagram.com/neverbe196",
          "https://tiktok.com/@neverbe196",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+94 70 520 8999",
          contactType: "Customer Service",
          areaServed: "LK",
          availableLanguage: ["English", "Sinhala", "Tamil"],
        },
      },
      {
        "@type": "AboutPage",
        name: "About NEVERBE",
        description:
          "Learn about NEVERBE, Sri Lanka's trusted destination for premium shoes, clothing & apparel. Discover our mission, vision, and commitment to style, quality, and affordability.",
        url: "https://neverbe.lk/aboutUs",
        inLanguage: "en-LK",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AboutUsClient />
    </>
  );
};

export default AboutUs;
