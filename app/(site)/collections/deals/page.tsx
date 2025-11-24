import DealsHeader from "./components/DealsHeader";
import DealsProducts from "./components/DealsProducts";
import EmptyState from "@/components/EmptyState";
import { getDealsProducts } from "@/services/ProductService";
import { seoKeywords } from "@/constants";
import { Product } from "@/interfaces/Product";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    default: "Best Sneaker Deals & Discounts | NEVERBE Sri Lanka",
    template: "%s | NEVERBE",
  },
  description:
    "Get the best prices on high-quality First Copy and Master Copy shoes in Sri Lanka. Exclusive discounts on premium inspired sneakers, slides, and sandals.",
  keywords: [
    "shoe deals sri lanka",
    "discount sneakers colombo",
    "first copy shoe prices",
    "master copy sneaker sale",
    "budget shoes sri lanka",
    "shoe offers online",
    "clearance shoes sri lanka",
    "best shoe rates sri lanka",
    "cod shoes sri lanka",
    ...seoKeywords,
  ],
  alternates: {
    canonical: "https://neverbe.lk/collections/deals",
  },
  openGraph: {
    title: "Hot Sneaker Deals & Offers | NEVERBE",
    description:
      "Save big on premium inspired footwear. The best place for affordable 7A and Master Copy sneakers in Sri Lanka.",
    url: "https://neverbe.lk/collections/deals",
    siteName: "NEVERBE",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/deals-og.jpg",
        width: 1200,
        height: 630,
        alt: "NEVERBE Deals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@neverbe",
    creator: "@neverbe",
    title: "Hot Sneaker Deals & Offers | NEVERBE",
    description:
      "Don't miss out on the best sneaker prices in Sri Lanka. Shop now at NEVERBE.",
    images: ["https://neverbe.lk/deals-og.jpg"],
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
  category: "Ecommerce",
  metadataBase: new URL("https://neverbe.lk"),
};

const Page = async () => {
  let items: { dataList: Product[] } = { dataList: [] };

  try {
    items = await getDealsProducts(undefined, undefined, 1, 20);
  } catch (e) {
    console.error("Error fetching deal items:", e);
  }

  const dealsList = items?.dataList || [];

  const dealsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shoe Deals and Discounts - NEVERBE",
    description:
      "Find the best discounts on premium inspired sneakers in Sri Lanka.",
    url: "https://neverbe.lk/collections/deals",
    inLanguage: "en-LK",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: dealsList.map((product: Product, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product?.name,
          image: product?.thumbnail?.url || "https://neverbe.lk/api/v1/og",
          description:
            product?.description ||
            "Discounted premium footwear at NEVERBE Sri Lanka.",
          url: `https://neverbe.lk/collections/products/${product?.id}`,
          brand: {
            "@type": "Brand",
            name: "NEVERBE",
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "LKR",
            price: product?.sellingPrice || "0.00",
            availability: "https://schema.org/InStock",
            url: `https://neverbe.lk/collections/products/${product?.id}`,
            priceValidUntil: new Date(
              Date.now() + 1000 * 60 * 60 * 24 * 30
            ).toISOString(),
          },
        },
      })),
    },
  };

  return (
    <main className="w-full relative lg:mt-28 mt-16 mb-5 overflow-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dealsSchema) }}
      />

      <DealsHeader />

      <div className="px-4">
        {dealsList.length > 0 ? (
          <DealsProducts items={dealsList} />
        ) : (
          <EmptyState heading="No deals available at this time." />
        )}
      </div>
    </main>
  );
};

export default Page;
