import { Metadata } from "next";
import PrivacyPolicyClient from "./components/PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy - NEVERBE Sri Lanka",
  description:
    "Read NEVERBE's Privacy Policy outlining how we collect, use, and protect your data. Trusted online shoe store in Sri Lanka.",
  keywords:
    "NEVERBE, privacy policy, data protection, online shoe store Sri Lanka, nike replica, adidas replica, sneakers Sri Lanka",
  alternates: {
    canonical: "https://neverbe.lk/policies/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy - NEVERBE Sri Lanka",
    description:
      "Read NEVERBE's Privacy Policy outlining how we collect, use, and protect your data.",
    url: "https://neverbe.lk/policies/privacy-policy",
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
    title: "Privacy Policy - NEVERBE Sri Lanka",
    description:
      "Read NEVERBE's Privacy Policy outlining how we collect, use, and protect your data.",
    images: ["https://neverbe.lk/api/v1/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const Page = () => {
  /* ✅ Structured Data: WebPage + Organization */
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Privacy Policy",
      description:
        "NEVERBE Privacy Policy outlining how we collect, use, and protect your data.",
      url: "https://neverbe.lk/policies/privacy-policy",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "NEVERBE",
      url: "https://neverbe.lk",
      logo: "https://neverbe.lk/api/v1/og",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+94 70 520 8999",
        contactType: "Customer Service",
        areaServed: "LK",
        availableLanguage: ["English", "Sinhala", "Tamil"],
      },
      sameAs: [
        "https://www.facebook.com/neverbe196",
        "https://www.instagram.com/neverbe196",
        "https://tiktok.com/@neverbe196",
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PrivacyPolicyClient />
    </>
  );
};

export default Page;
