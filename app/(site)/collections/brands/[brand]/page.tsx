import type { Metadata } from "next";
import { Item } from "@/interfaces";
import BrandProducts from "./components/BrandProducts";
import BrandHeader from "./components/BrandHeader";
import { getProductsByBrand } from "@/services/ProductService";

// OPTIMIZATION: Cache for 1 hour.
export const revalidate = 3600;

// Helper to clean brand names
const cleanName = (str: string) => decodeURIComponent(str).replace(/-/g, " ");

export async function generateMetadata(context: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const params = await context.params;
  const brandName = cleanName(params.brand);
  const capitalizedBrand =
    brandName.charAt(0).toUpperCase() + brandName.slice(1);

  // SEO STRATEGY: Target "Price" and "Buy" directly.
  // "Nike Copy Shoes Price in Sri Lanka" is a very common search.
  const title = `${capitalizedBrand} First Copy Shoes Price in Sri Lanka | Buy Online — NEVERBE`;

  const description = `Looking for ${capitalizedBrand} shoes in Sri Lanka? Shop premium First Copy and Master Copy ${capitalizedBrand} sneakers at the best prices. Island-wide delivery.`;

  return {
    title,
    description,
    keywords: [
      `${capitalizedBrand} shoes price sri lanka`,
      `${capitalizedBrand} copy shoes`,
      `${capitalizedBrand} first copy`,
      `${capitalizedBrand} master copy`,
      `buy ${capitalizedBrand} sneakers`,
      "7a quality shoes",
      "branded copy shoes",
    ],
    alternates: {
      canonical: `https://neverbe.lk/collections/brands/${params.brand}`,
    },
    openGraph: {
      title,
      description,
      url: `https://neverbe.lk/collections/brands/${params.brand}`,
      type: "website",
      siteName: "NEVERBE",
      locale: "en_LK",
      images: [
        {
          url: "https://neverbe.lk/api/v1/og", // Dynamic brand image would be better if available
          width: 1200,
          height: 630,
          alt: `${capitalizedBrand} Sneakers Sri Lanka`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
    metadataBase: new URL("https://neverbe.lk"),
  };
}

const Page = async (context: { params: Promise<{ brand: string }> }) => {
  const params = await context.params;
  const brandRaw = params.brand;
  const brandName = cleanName(brandRaw);

  let items: Item[] = [];

  try {
    const res = await getProductsByBrand(brandName, 1, 20);
    items = res.dataList || [];
  } catch (e) {
    console.error("Error fetching brand products:", e);
  }

  /* ✅ Schema.org: Optimized for Brand Collections */
  const productListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${brandName} First Copy Shoes - NEVERBE`,
    description: `Buy high-quality ${brandName} master copy shoes in Sri Lanka.`,
    url: `https://neverbe.lk/collections/brands/${encodeURIComponent(
      brandRaw
    )}`,
    inLanguage: "en-LK",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          image: product.thumbnail?.url || "https://neverbe.lk/api/v1/og",
          description:
            product.description || `Shop ${product.name} at NEVERBE.`,
          url: `https://neverbe.lk/collections/products/${product.id}`,
          brand: {
            "@type": "Brand",
            name: "NEVERBE", // Keep as Store Brand to avoid trademark issues in Schema
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "LKR",
            price: product.sellingPrice || "0.00",
            availability: "https://schema.org/InStock",
            url: `https://neverbe.lk/collections/products/${product.id}`,
            itemCondition: "https://schema.org/NewCondition",
          },
        },
      })),
    },
  };

  return (
    <main className="w-full relative mt-4 lg:mt-8 mb-5 overflow-hidden min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productListSchema),
        }}
      />
      <section className="w-full">
        <BrandHeader brand={brandName} />
        <BrandProducts items={items} brand={brandName} />
      </section>

      {/* Fine Print SEO Footer */}
      <section className="max-w-[1440px] mx-auto px-4 py-12 border-t border-gray-100 mt-12">
        <article className="grid md:grid-cols-2 gap-8 text-xs text-gray-400 leading-relaxed text-justify md:text-left">
          <div>
            <h2 className="text-black font-bold uppercase tracking-wide mb-2">
              {brandName} First Copy Shoes in Sri Lanka
            </h2>
            <p>
              NEVERBE is your ultimate destination for {brandName} Master Copy
              offer the same premium look and feel as the originals but at a
              fraction of the cost.
            </p>
          </div>
          <div>
            <h3 className="text-black font-bold uppercase tracking-wide mb-2">
              Why Buy {brandName} Copies?
            </h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Premium Quality 7A Grade Materials</li>
              <li>Competitive Prices in Sri Lanka</li>
              <li>Island-wide Delivery to Colombo, Kandy, Galle</li>
            </ul>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Page;
