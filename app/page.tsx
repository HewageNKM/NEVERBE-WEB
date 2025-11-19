import Hero from "@/app/components/Hero";
import NewArrivals from "@/app/components/NewArrivals";
import WhyUs from "@/app/components/WhyUs";
import PopularProducts from "@/app/components/PopularProducts";
import FAQ from "@/app/components/FAQ";
import BrandsSlider from "./components/BrandsSlider";
import { getHotProducts, getRecentItems } from "@/services/ProductService";
import { getSliders } from "@/services/SlideService";
import { getBrands } from "@/services/OtherService";
import type { Metadata } from "next";
import { seoKeywords } from "@/constants";

export const metadata: Metadata = {
  title: {
    default: "NEVERBE — Premium First Copy & Replica Shoes in Sri Lanka",
    template: "%s | NEVERBE",
  },
  metadataBase: new URL("https://neverbe.lk"),
  alternates: {
    canonical: "https://neverbe.lk",
  },
  description:
    "Buy high-quality 7A and Master Copy shoes in Sri Lanka. Best prices for Nike, Adidas, and New Balance inspired sneakers. Islandwide delivery available.",
  applicationName: "NEVERBE",
  keywords: [
    "first copy shoes sri lanka",
    "master copy sneakers",
    "branded copy shoes",
    "budget shoes sri lanka",
    "nike copy prices",
    "7a quality shoes sri lanka",
    ...seoKeywords,
  ],
  category: "Fashion E-commerce",
  authors: [{ name: "NEVERBE", url: "https://neverbe.lk" }],
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
  openGraph: {
    title: "NEVERBE — Best Shoe Copies & Replicas in Sri Lanka",
    description:
      "Get the best look for less. Premium replica sneakers including Nike and Adidas designs. Fast delivery in Colombo and Islandwide.",
    url: "https://neverbe.lk",
    siteName: "NEVERBE",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/api/v1/og",
        alt: "NEVERBE Sneaker Store",
        width: 1200,
        height: 630,
      },
    ],
  },
};

// OPTIMIZATION: Switch to ISR (Incremental Static Regeneration)
// This caches the page for 1 hour (3600s). This is much faster than force-dynamic.
export const revalidate = 3600; 

const Page = async () => {
  // OPTIMIZATION: Fetch data in parallel to reduce load time
  const dataPromise = Promise.all([
    getRecentItems().catch((err) => { console.error("Recent items failed", err); return []; }),
    getSliders().catch((err) => { console.error("Sliders failed", err); return []; }),
    getHotProducts().catch((err) => { console.error("Hot items failed", err); return []; }),
    getBrands().catch((err) => { console.error("Brands failed", err); return []; }),
  ]);

  const [arrivals, sliders, hotItems, brands] = await dataPromise;

  /* ✅ Schema.org Structured Data */
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Store",
        name: "NEVERBE",
        url: "https://neverbe.lk",
        logo: "https://neverbe.lk/api/v1/og",
        image: "https://neverbe.lk/api/v1/og",
        description: "Retailer of fashion footwear and inspired sneaker designs in Sri Lanka.",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressCountry: "LK",
          addressRegion: "Western Province"
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+94 70 520 8999",
          contactType: "Customer Service",
          areaServed: "LK",
          availableLanguage: ["English", "Sinhala", "Tamil"],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Are these shoes original brands?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No, these are high-quality premium replicas (First Copy/Master Copy) inspired by popular designs, offering a similar look at a budget-friendly price.",
            },
          },
          {
            "@type": "Question",
            name: "Do you deliver across Sri Lanka?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, NEVERBE delivers islandwide within 2–5 business days via trusted courier partners.",
            },
          },
        ],
      }
    ]
  };

  return (
    <main className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Hero slides={sliders} />
      
      {/* OPTIMIZATION: Render sections only if data exists to prevent layout shift */}
      {hotItems.length > 0 && <PopularProducts hotItems={hotItems} />}
      {arrivals.length > 0 && <NewArrivals arrivals={arrivals} />}
      {brands.length > 0 && <BrandsSlider items={brands} />}
      
      <WhyUs />
      <FAQ />
    </main>
  );
};

export default Page;