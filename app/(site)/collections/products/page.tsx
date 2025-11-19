import Products from "@/app/(site)/collections/products/components/Products";
import ProductsHeader from "@/app/(site)/collections/products/components/ProductsHeader";
import EmptyState from "@/components/EmptyState";
import { getProducts } from "@/services/ProductService";
import { seoKeywords } from "@/constants";
import type { Metadata } from "next";

// OPTIMIZATION: Switch to ISR. Cache this page for 1 hour.
// This makes the "All Products" page load instantly instead of waiting for the DB every time.
export const revalidate = 3600; 

export const metadata: Metadata = {
  title: {
    default: "Shop All First Copy & Master Copy Shoes | NEVERBE Sri Lanka",
    template: "%s | NEVERBE",
  },
  description:
    "Browse Sri Lanka's largest collection of 7A and Master Copy sneakers. High-quality inspired designs, slides, and sandals with islandwide delivery.",
  keywords: [
    // LEGAL SAFEGUARD: Target the "Quality Tier" rather than the "Brand Name"
    "first copy shoes sri lanka",
    "master copy sneakers",
    "7a quality shoes",
    "branded copy shoes",
    "premium replica footwear",
    "mens shoes online sri lanka",
    "budget sneakers sri lanka",
    "vietnam copy shoes",
    "shoes cash on delivery",
    ...seoKeywords,
  ],
  alternates: {
    canonical: "https://neverbe.lk/collections/products",
  },
  openGraph: {
    title: "Shop Premium First Copy Sneakers | NEVERBE",
    description:
      "The best place to buy high-quality inspired sneakers in Sri Lanka. Master copy and 7A grade shoes at the best prices.",
    url: "https://neverbe.lk/collections/products",
    type: "website",
    siteName: "NEVERBE",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/api/v1/og",
        width: 1200,
        height: 630,
        alt: "NEVERBE Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@neverbe",
    creator: "@neverbe",
    title: "Shop Premium First Copy Sneakers | NEVERBE",
    description:
      "Browse premium inspired footwear at NEVERBE. Islandwide delivery available.",
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
  metadataBase: new URL("https://neverbe.lk"),
};

const Page = async () => {
  let items: any = {};

  try {
    // Fetch first 20 items for the initial static render
    items = await getProducts(undefined, undefined, 1, 20);
  } catch (e) {
    console.error("Error fetching items:", e);
    items = { dataList: [] };
  }

  const productList = items?.dataList || [];

  /* ✅ Structured Data: Collection Page */
  const productListingSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Products - NEVERBE",
    description:
      "Explore NEVERBE’s full collection of premium inspired sneakers, slides, and sandals available across Sri Lanka.",
    url: "https://neverbe.lk/collections/products",
    inLanguage: "en-LK",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: productList.map((product: any, index: number) => ({
        "@type": "ListItem", // Correct type for list items
        position: index + 1,
        item: {
            "@type": "Product",
            name: product?.name,
            image: product?.thumbnail?.url || "https://neverbe.lk/api/v1/og",
            description: product?.description || "Premium footwear available at NEVERBE Sri Lanka.",
            // FIX: Ensure this URL matches your actual route structure (/collections/products/ID)
            url: `https://neverbe.lk/collections/products/${product?.id}`, 
            brand: {
                "@type": "Brand",
                name: "NEVERBE" // Legal Safeguard: Do not claim "Nike" here
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "LKR",
              price: product?.sellingPrice || product?.price || "0.00", // Use sellingPrice if available
              availability: "https://schema.org/InStock",
            },
        }
      })),
    },
  };

  return (
    <main className="w-full relative lg:mt-28 mt-16 mb-5 overflow-clip">
      {/* ✅ Inject Product Listing Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productListingSchema),
        }}
      />

      <ProductsHeader />

      <div className="px-4">
        {productList.length > 0 ? (
          <Products items={productList} />
        ) : (
          <EmptyState heading="No products available at this time." />
        )}
      </div>
    </main>
  );
};

export default Page;