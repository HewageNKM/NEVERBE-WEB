import { Metadata } from "next";
import ShippingReturnPolicyClient from "./components/ShippingReturnPolicyClient";

export const metadata: Metadata = {
  title: "Shipping & Return Policy - NEVERBE Sri Lanka",
  description:
    "Read NEVERBE's shipping & return policy outlining how we manage shipping and returns. Fast delivery and easy returns across Sri Lanka.",
  keywords:
    "NEVERBE, shipping policy, return policy, delivery Sri Lanka, online shoe store Sri Lanka, nike replica, adidas replica, sneakers Sri Lanka",
  alternates: {
    canonical: "https://neverbe.lk/policies/shipping-return-policy",
  },
  openGraph: {
    title: "Shipping & Return Policy - NEVERBE Sri Lanka",
    description:
      "Read NEVERBE's shipping & return policy outlining how we manage shipping and returns.",
    url: "https://neverbe.lk/policies/shipping-return-policy",
    siteName: "NEVERBE",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/logo-og.png",
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
    title: "Shipping & Return Policy - NEVERBE Sri Lanka",
    description:
      "Read NEVERBE's shipping & return policy outlining how we manage shipping and returns.",
    images: ["https://neverbe.lk/logo-og.png"],
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
  /* ✅ Structured Data for Google Rich Results */
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Shipping & Return Policy",
      description:
        "NEVERBE Shipping & Return Policy outlining how we manage shipping and returns.",
      url: "https://neverbe.lk/policies/shipping-return-policy",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "NEVERBE",
      url: "https://neverbe.lk",
      logo: "https://neverbe.lk/logo-og.png",
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
      <ShippingReturnPolicyClient />
    </>
  );
};

export default Page;
