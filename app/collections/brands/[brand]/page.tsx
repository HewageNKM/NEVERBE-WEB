import type { Metadata } from "next";
import { Item } from "@/interfaces";
import BrandProducts from "./components/BrandProducts";
import BrandHeader from "./components/BrandHeader";
import { getProductsByBrand } from "@/services/ProductService";


export const revalidate = 3600;

export async function generateMetadata(context: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const params = await context.params;
  const decodedBrand = decodeURIComponent(params.brand).replace(/-/g, " ");
  
  const capitalizedBrand = decodedBrand.charAt(0).toUpperCase() + decodedBrand.slice(1);

  const title = `${capitalizedBrand} Inspired Collection | NEVERBE Sri Lanka`;
  
  const description = `Shop premium ${capitalizedBrand} style sneakers at NEVERBE. High-quality First Copy and Master Copy shoes with islandwide delivery in Sri Lanka.`;

  return {
    title,
    description,
    keywords: [
      `${capitalizedBrand} copy shoes`,
      `${capitalizedBrand} first copy sri lanka`,
      `${capitalizedBrand} master copy`,
      `${capitalizedBrand} 7a quality`,
      "branded copy shoes",
      "sneakers sri lanka",
      "neverbe",
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
          url: "https://neverbe.lk/api/v1/og",
          width: 1200,
          height: 630,
          alt: `${capitalizedBrand} Style Sneakers - NEVERBE`,
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
    metadataBase: new URL("https://neverbe.lk"),
  };
}

const Page = async (context: { params: Promise<{ brand: string }> }) => {
  const params = await context.params;
  const brand = decodeURIComponent(params.brand).replace(/-/g, " ");
  let items: Item[] = [];

  try {
    const res = await getProductsByBrand(brand, 1, 20);
    items = res.dataList || [];
  } catch (e) {
    console.error("Error fetching brand products:", e);
  }

  /* ✅ Schema.org: CollectionPage (Removed "Brand" Entity) */
  // Note: We removed the standalone "@type": "Brand" schema because 
  // unless you are the official owner of Nike, you cannot claim the page represents the Brand entity.
  const productListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${brand} Inspired Collection - NEVERBE`,
    description: `Shop high-quality ${brand} style replica shoes in Sri Lanka.`,
    url: `https://neverbe.lk/collections/brands/${encodeURIComponent(brand)}`,
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
          description: product.description || `Shop ${product.name} at NEVERBE.`,
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
            url: `https://neverbe.lk/collections/products/${product.id}`,
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
        <BrandHeader brand={brand} />
        
        {items.length > 0 ? (
             <BrandProducts items={items} brand={brand} />
        ) : (
            <div className="text-center py-20 text-gray-500">
                <p>No products found for {brand}.</p>
            </div>
        )}
      </section>
    </main>
  );
};

export default Page;