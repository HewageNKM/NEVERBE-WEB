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
    <main className="w-full relative lg:mt-28 mt-16 mb-5 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productListSchema),
        }}
      />

      <section className="w-full">
        <BrandHeader brand={brandName} />

        {items.length > 0 ? (
          <BrandProducts items={items} brand={brandName} />
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg mx-4">
            <h3 className="text-xl font-bold text-gray-700">
              New Stock Coming Soon
            </h3>
            <p className="text-gray-500 mt-2">
              We are updating our collection of {brandName} sneakers. Please
              check back later!
            </p>
          </div>
        )}
      </section>

      {/* ✅ DYNAMIC SEO FOOTER: Brand Specific Content */}
      <section className="container mx-auto px-4 py-12 border-t border-gray-100 mt-12 bg-gray-50 rounded-xl">
        <article className="prose prose-sm max-w-none text-gray-600">
          <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">
            {brandName} Shoes Price in Sri Lanka
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p>
                Are you looking for the best{" "}
                <strong>{brandName} shoes price in Sri Lanka</strong>? NEVERBE
                is your ultimate destination. We stock a wide range of
                <strong> {brandName} first copy shoes</strong> that offer the
                same premium look and feel as the originals but at a fraction of
                the cost.
              </p>
              <p className="mt-2">
                Our collection features the latest{" "}
                <strong>{brandName} Master Copy</strong> sneakers, perfect for
                sports, gym, or casual wear. Why overpay when you can get
                high-quality
                <strong> 7A quality {brandName} sneakers</strong> delivered to
                your doorstep?
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                Why Buy {brandName} Copies from NEVERBE?
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Premium Quality:</strong> We ensure our{" "}
                  <strong>{brandName} replicas</strong>
                  are durable and comfortable.
                </li>
                <li>
                  <strong>Island-wide Delivery:</strong> Get your favorite kicks
                  delivered to Colombo, Kandy, Galle, or anywhere in Sri Lanka.
                </li>
                <li>
                  <strong>Best Rates:</strong> We offer the most competitive
                  <strong> {brandName} copy shoe prices</strong> in the market.
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
