import type { Metadata } from "next";
import { Product } from "@/interfaces/Product";
import CategoryProducts from "./components/CategoryProducts";
import CategoryHeader from "./components/CategoryHeader";
import { getProductsByCategory } from "@/services/ProductService";

export async function generateMetadata(context: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const params = await context.params;
  const categoryName = decodeURIComponent(params.category).replace(/-/g, " ");
  const capitalizedCategory =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  const title = `${capitalizedCategory} Collection | NEVERBE Sri Lanka`;
  const description = `Shop premium ${capitalizedCategory} at NEVERBE Sri Lanka. Discover top-quality Nike, Adidas, Puma, and New Balance replica shoes with great offers and fast delivery.`;

  return {
    title,
    description,
    keywords: [
      capitalizedCategory,
      `${capitalizedCategory} Sri Lanka`,
      `${capitalizedCategory} online store`,
      `${capitalizedCategory} offers`,
      `${capitalizedCategory} discounts`,
      "neverbe",
      "neverbe.lk",
      "shoes sri lanka",
      "nike sri lanka",
      "adidas sri lanka",
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
          url: "https://neverbe.lk/api/v1/og",
          width: 1200,
          height: 630,
          alt: `${capitalizedCategory} - NEVERBE Sri Lanka`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@neverbe",
      creator: "@neverbe",
      title,
      description,
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
    category: "Ecommerce",
    metadataBase: new URL("https://neverbe.lk"),
  };
}

const Page = async ( context: { params: Promise<{ category: string }> }) => {
  const params = await context.params;
  const category = decodeURIComponent(params.category).replace(/-/g, " ");
  let items: Product[] = [];

  try {
    const res = await getProductsByCategory(category, 1, 20);
    items = res.dataList || [];
  } catch (e) {
    console.error("Error fetching category items:", e);
  }

  /* ✅ Schema.org for rich results (CollectionPage + ItemList) */
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category} Collection - NEVERBE Sri Lanka`,
    description: `Explore the ${category} collection featuring Nike, Adidas, Puma, and New Balance replica shoes available in Sri Lanka.`,
    url: `https://neverbe.lk/collections/categories/${encodeURIComponent(
      category
    )}`,
    inLanguage: "en-LK",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((product, index) => ({
        "@type": "Product",
        position: index + 1,
        name: product.name,
        image: product.thumbnail?.url || "https://neverbe.lk/api/v1/og",
        description:
          product.description ||
          `Shop ${product.name} available now at NEVERBE Sri Lanka.`,
        url: `https://neverbe.lk/product/${product.id}`,
        brand: {
          "@type": "Brand",
          name: "NEVERBE",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "LKR",
          price: product.sellingPrice || "0.00",
          availability: "https://schema.org/InStock",
          url: `https://neverbe.lk/product/${product.id}`,
          priceValidUntil: new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 30
          ).toISOString(),
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
        <CategoryHeader category={category} />
        <CategoryProducts items={items} category={category} />
      </section>
    </main>
  );
};

export default Page;