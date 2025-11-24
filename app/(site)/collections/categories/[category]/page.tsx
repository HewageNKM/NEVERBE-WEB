import type { Metadata } from "next";
import { Product } from "@/interfaces/Product";
import CategoryProducts from "./components/CategoryProducts";
import CategoryHeader from "./components/CategoryHeader";
import { getProductsByCategory } from "@/services/ProductService";


export const revalidate = 3600;

export async function generateMetadata(context: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const params = await context.params;
  const rawCategory = decodeURIComponent(params.category).replace(/-/g, " ");
  
  // Helper to capitalize first letter
  const capitalizedCategory = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);

  const title = `${capitalizedCategory} Style Shoes | NEVERBE Sri Lanka`;
  
  const description = `Shop premium ${capitalizedCategory} inspired sneakers at NEVERBE. High-quality 7A and Master Copy footwear with islandwide delivery in Sri Lanka.`;

  return {
    title,
    description,
    keywords: [
      `${capitalizedCategory} copy shoes`,
      `${capitalizedCategory} first copy`,
      `${capitalizedCategory} style sneakers`,
      "first copy shoes sri lanka",
      "master copy footwear",
      "online shoe store sri lanka",
      "neverbe collections",
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
          url: "https://neverbe.lk/shoes-og.jpg",
          width: 1200,
          height: 630,
          alt: `${capitalizedCategory} Collection - NEVERBE`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@neverbe",
      creator: "@neverbe",
      title,
      description,
      images: ["https://neverbe.lk/shoes-og.jpg"],
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
}

const Page = async (context: { params: Promise<{ category: string }> }) => {
  const params = await context.params;
  const category = decodeURIComponent(params.category).replace(/-/g, " ");
  let items: Product[] = [];

  try {
    // Fetching data
    const res = await getProductsByCategory(category, 1, 20);
    items = res.dataList || [];
  } catch (e) {
    console.error("Error fetching category items:", e);
  }

  /* ✅ Schema.org: Optimized for Google Merchant / Rich Results */
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category} Collection - NEVERBE`,
    description: `Explore the ${category} inspired collection. Premium first copy sneakers available in Sri Lanka.`,
    url: `https://neverbe.lk/collections/categories/${encodeURIComponent(params.category)}`,
    inLanguage: "en-LK",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((product, index) => ({
        "@type": "ListItem", // CORRECT: Google requires 'ListItem' wrapper
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          image: product.thumbnail?.url || "https://neverbe.lk/api/v1/og",
          description: product.description || `Shop ${product.name} at NEVERBE.`,
          // FIX: Ensure this URL matches your actual Product Page route
          url: `https://neverbe.lk/collections/products/${product.id}`,
          brand: {
            "@type": "Brand",
            name: "NEVERBE", // LEGAL: Always claim the 'store brand', not the 'manufacturer'
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "LKR",
            price: product.sellingPrice || "0.00",
            availability: "https://schema.org/InStock",
            url: `https://neverbe.lk/collections/products/${product.id}`,
            priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
          },
        },
      })),
    },
  };

  return (
    <main className="w-full relative lg:mt-28 mt-16 mb-5 overflow-hidden">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />

      <section className="w-full">
        {/* Note: Ensure your CategoryHeader accepts the "category" string.
           You might want to pass "Inspired" text here too if possible in UI 
        */}
        <CategoryHeader category={category} />
        
        {items.length > 0 ? (
            <CategoryProducts items={items} category={category} />
        ) : (
            <div className="text-center py-20 text-gray-500">
                <p>No items found in this collection.</p>
            </div>
        )}
      </section>
    </main>
  );
};

export default Page;