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
    <main className="w-full relative lg:mt-28 mt-16 mb-5 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />

      <section className="w-full">
        <CategoryHeader category={categoryName} />

        {items.length > 0 ? (
          <CategoryProducts items={items} category={categoryName} />
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg mx-4">
            <h3 className="text-xl font-bold text-gray-700">
              Collection Update In Progress
            </h3>
            <p className="text-gray-500 mt-2">
              We are restocking our {categoryName}. Check back soon!
            </p>
          </div>
        )}
      </section>

      {/* ✅ DYNAMIC SEO FOOTER: The Key to Ranking Specific Categories */}
      <section className="container mx-auto px-4 py-12 border-t border-gray-100 mt-12 bg-gray-50 rounded-xl">
        <article className="prose prose-sm max-w-none text-gray-600">
          <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">
            Buy {categoryName} in Sri Lanka
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p>
                Browse our exclusive collection of{" "}
                <strong>{categoryName}</strong> at NEVERBE. Whether you are
                looking for durability, style, or comfort, we bring you the best
                options in the market. We are one of the leading online stores
                for
                <strong> {categoryName} in Sri Lanka</strong>.
              </p>
              <p className="mt-2">
                Get the premium look you deserve. Our range of{" "}
                <strong>{categoryName}</strong> is perfect for daily wear or
                special occasions. Order online today and enjoy fast island-wide
                delivery to your doorstep.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Why Buy From Us?
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Best Prices:</strong> We offer the most competitive
                  rates for
                  <strong> {categoryName}</strong> in Colombo and island-wide.
                </li>
                <li>
                  <strong>Quality Guarantee:</strong> Every pair is inspected to
                  ensure you get premium quality footwear.
                </li>
                <li>
                  <strong>Cash on Delivery:</strong> Shop with confidence and
                  pay only when you receive your order.
                </li>
              </ul>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Page;
