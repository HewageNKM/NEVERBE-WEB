export const revalidate = 3600;

import CollectionProducts from "@/app/(site)/collections/components/CollectionProducts";
import { getProducts } from "@/services/ProductService";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Men's Sneakers & Footwear | NEVERBE",
  description:
    "Shop the best collection of men's sneakers in Sri Lanka. Premium quality 7A copies of top brands.",
  openGraph: {
    title: "Men's Sneakers & Footwear | NEVERBE",
    description: "Shop the best collection of men's sneakers in Sri Lanka.",
    url: "https://neverbe.lk/collections/men",
    images: [
      {
        url: "https://neverbe.lk/logo-og.png", // Ensure this image is generic/appealing
        width: 1200,
        height: 630,
        alt: "NEVERBE Men's Collection",
      },
    ],
    type: "website",
  },
};

const MenPage = async () => {
  // Filter by 'Men' tag
  const { total, dataList } = await getProducts(["Men"], undefined, 1, 20);

  return (
    <main className="w-full min-h-screen bg-white pt-8">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 mb-8 text-left">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          Men
        </h1>
        <p className="text-gray-500 max-w-xl text-sm md:text-base">
          Explore our exclusive range of footwear designed for men.
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Men's Sneakers & Footwear | NEVERBE",
            description:
              "Shop the best collection of men's sneakers in Sri Lanka.",
            url: "https://neverbe.lk/collections/men",
            inLanguage: "en-LK",
            mainEntity: {
              "@type": "ItemList",
              itemListElement: dataList.map((product: any, index: number) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Product",
                  name: product.name,
                  image:
                    product.thumbnail?.url || "https://neverbe.lk/logo-og.png",
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
          }),
        }}
      />

      <CollectionProducts
        initialItems={dataList}
        collectionType="men"
        tagName="Men"
        total={total}
      />
    </main>
  );
};

export default MenPage;
