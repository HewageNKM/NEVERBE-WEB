import type { Metadata } from "next";
import { Product } from "@/interfaces/Product";
import CategoryProducts from "./components/CategoryProducts";
import CategoryHeader from "./components/CategoryHeader";
import { getProductsByCategory } from "@/services/ProductService";

// OPTIMIZATION: Cache for 1 hour.
export const revalidate = 3600;

// Helper to clean category names (e.g., "Running%20Shoes" -> "Running Shoes")
const cleanName = (str: string) => decodeURIComponent(str).replace(/-/g, " ");

export async function generateMetadata(context: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const params = await context.params;
  const categoryName = cleanName(params.category);
  const capitalized =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  // SEO STRATEGY: Dynamic Title based on category
  // This helps you rank for "Running Shoes Sri Lanka" vs just "Running Shoes"
  const title = `${capitalized} Price in Sri Lanka | Buy ${capitalized} Online — NEVERBE`;

  const description = `Looking for ${capitalized} in Sri Lanka? Shop the best collection of ${capitalized} and premium footwear at NEVERBE. Island-wide cash on delivery.`;

  return {
    title,
    description,
    keywords: [
      `${capitalized} sri lanka`,
      `${capitalized} price`,
      `buy ${capitalized} online`,
      "shoes sri lanka",
      "footwear",
      "online shoe store",
    ],
    alternates: {
      canonical: `https://neverbe.lk/collections/categories/${params.category}`,
    },
    openGraph: {
      title,
      description,
      url: `https://neverbe.lk/collections/categories/${params.category}`,
      type: "website",
      siteName: "NEVERBE",
      locale: "en_LK",
      images: [
        {
          url: "https://neverbe.lk/api/v1/og", // Ideally, dynamic images per category
          width: 1200,
          height: 630,
          alt: `${capitalized} Collection`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const Page = async (context: { params: Promise<{ category: string }> }) => {
  const params = await context.params;
  const categoryRaw = params.category;
  const categoryName = cleanName(categoryRaw);

  let items: Product[] = [];

  try {
    const res = await getProductsByCategory(categoryName, 1, 20);
    items = res.dataList || [];
  } catch (e) {
    console.error("Error fetching category items:", e);
  }

  /* ✅ Schema.org: CollectionPage */
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} Collection - NEVERBE`,
    description: `Buy ${categoryName} online in Sri Lanka.`,
    url: `https://neverbe.lk/collections/categories/${categoryRaw}`,
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
          url: `https://neverbe.lk/collections/products/${product.id}`,
          brand: {
            "@type": "Brand",
            name: "NEVERBE",
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "LKR",
            price: product.sellingPrice || "0.00",
            availability: "https://schema.org/InStock",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />
      <section className="w-full">
        <CategoryHeader category={categoryName} />
        <CategoryProducts items={items} category={categoryName} />
      </section>

      {/* Fine Print SEO Footer */}
      <section className="max-w-[1440px] mx-auto px-4 py-12 border-t border-gray-100 mt-12">
        <article className="grid md:grid-cols-2 gap-8 text-xs text-gray-400 leading-relaxed text-justify md:text-left">
          <div>
            <h2 className="text-black font-bold uppercase tracking-wide mb-2">
              Premium {categoryName} in Sri Lanka
            </h2>
            <p>
              Browse our exclusive collection of {categoryName} at NEVERBE. We
              are one of the leading online stores for premium footwear in Sri
              Lanka. Our Master Copy collection offers the look and feel of
              global brands at a fraction of the price.
            </p>
          </div>
          <div>
            <h3 className="text-black font-bold uppercase tracking-wide mb-2">
              Why Buy From Us?
            </h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Best Prices in Colombo</li>
              <li>Cash on Delivery Island-wide</li>
              <li>Premium Quality Guaranteed</li>
            </ul>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Page;
