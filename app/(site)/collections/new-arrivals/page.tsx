export const revalidate = 3600;

import CollectionProducts from "@/app/(site)/collections/components/CollectionProducts";
import { getNewArrivals } from "@/services/ProductService";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Arrivals - Latest Sneaker Drops | NEVERBE",
  description:
    "Shop the latest arrivals at NEVERBE. Discover the newest 7A quality sneakers, slides, and footwear drops in Sri Lanka.",
  openGraph: {
    title: "New Arrivals - Latest Sneaker Drops | NEVERBE",
    description:
      "Discover the newest 7A quality sneakers, slides, and footwear drops in Sri Lanka.",
    url: "https://neverbe.lk/collections/new-arrivals",
    type: "website",
    images: [
      {
        url: "https://neverbe.lk/logo-og.png", // Ensure this image is generic/appealing
        width: 1200,
        height: 630,
        alt: "NEVERBE New Arrivals",
      },
    ],
  },
};

const NewArrivalsPage = async () => {
  const { total, dataList } = await getNewArrivals(1, 20);

  return (
    <main className="w-full min-h-screen bg-white">
      {/* 1. NIKE STYLE HEADER */}
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 py-12 md:py-20 text-left">
        <h1 className="text-[28px] md:text-[42px] font-medium tracking-tight text-primary leading-none mb-4">
          New Arrivals
        </h1>
        <p className="text-secondary max-w-xl text-[16px] md:text-[18px] font-normal">
          The latest heat. Fresh styles just added to the collection.
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "New Arrivals - Latest Sneaker Drops | NEVERBE",
            description:
              "Discover the newest 7A quality sneakers, slides, and footwear drops in Sri Lanka.",
            url: "https://neverbe.lk/collections/new-arrivals",
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
        collectionType="new-arrivals"
        tagName="New Arrivals"
        total={total}
      />

      {/* PREMIUM BRAND STORY FOOTER */}
      <section className="bg-surface-2 py-16 mt-0">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24">
            <div className="max-w-sm">
              <h2 className="text-[16px] font-medium text-primary mb-6">
                Fresh Drops Weekly
              </h2>
              <p className="text-[14px] text-secondary leading-relaxed mb-4">
                Stay with the trend. We update our collection with the latest
                releases from top global sneaker culture. 7A quality guaranteed.
              </p>
            </div>

            <div className="max-w-sm">
              <h3 className="text-[16px] font-medium text-primary mb-6">
                Trending Now
              </h3>
              <ul className="text-[14px] text-secondary space-y-3 font-medium">
                <li className="hover:text-black cursor-pointer transition-colors">
                  Retro High Tops
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  Chunky Dad Shoes
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  Minimalist Slides
                </li>
              </ul>
            </div>

            <div className="max-w-sm">
              <h3 className="text-[16px] font-medium text-primary mb-6">
                Limited Stock
              </h3>
              <p className="text-[14px] text-secondary leading-relaxed">
                Most new arrivals are limited runs. If you see your size, grab
                it before it&apos;s gone. Free returns on all new drops.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NewArrivalsPage;
