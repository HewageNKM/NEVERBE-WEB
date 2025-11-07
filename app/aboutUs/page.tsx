import React from "react";
import type { Metadata } from "next";
import AboutUsClient from "./components/AboutUsClient";

export const metadata: Metadata = {
  title: "About Us - NEVERBE Sri Lanka",
  description:
    "Learn about NEVERBE, Sri Lanka's trusted destination for premium replica shoes. Discover our mission, vision, and commitment to style, quality, and affordability.",
  keywords:
    "NEVERBE, about us, replica shoes Sri Lanka, nike replica, adidas replica, new balance Sri Lanka, sneakers Sri Lanka, online shoe store",
  alternates: {
    canonical: "https://neverbe.lk/about",
  },
  openGraph: {
    title: "About NEVERBE - Sri Lanka's Trusted Replica Shoe Store",
    description:
      "Learn about NEVERBE, Sri Lanka's trusted destination for premium replica shoes. Discover our mission, vision, and commitment to style, quality, and affordability.",
    url: "https://neverbe.lk/about",
    siteName: "NEVERBE",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/api/v1/og",
        width: 1200,
        height: 630,
        alt: "NEVERBE Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@neverbe",
    creator: "@neverbe",
    title: "About NEVERBE - Sri Lanka's Trusted Replica Shoe Store",
    description:
      "Learn about NEVERBE, Sri Lanka's trusted destination for premium replica shoes.",
    images: ["https://neverbe.lk/api/v1/og"],
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
        logo: "https://neverbe.lk/api/v1/og",
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
          "Learn about NEVERBE, Sri Lanka's trusted destination for premium replica shoes. Discover our mission, vision, and commitment to style, quality, and affordability.",
        url: "https://neverbe.lk/about",
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
