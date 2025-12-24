export const revalidate = 3600;

import CollectionProducts from "@/app/(site)/collections/components/CollectionProducts";
import { getNewArrivals } from "@/services/ProductService";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Arrivals - Latest Shoes & Sneakers | NEVERBE Sri Lanka",
  description:
    "Shop the newest shoes in Sri Lanka. Discover latest sneakers, slides & footwear drops. Premium 7A quality at best prices. Cash on Delivery island-wide.",
  alternates: { canonical: "https://neverbe.lk/collections/new-arrivals" },
  keywords: [
    "new shoes sri lanka",
    "latest sneakers",
    "new arrivals footwear",
    "new shoes colombo",
    "latest shoe drops",
  ],
  openGraph: {
    title: "New Arrivals - Latest Shoes & Sneakers | NEVERBE",
    description:
      "Shop the newest shoes in Sri Lanka. Latest sneakers, slides & footwear at best prices.",
    url: "https://neverbe.lk/collections/new-arrivals",
    type: "website",
    siteName: "NEVERBE",
    locale: "en_LK",
    images: [
      {
        url: "https://neverbe.lk/logo-og.png",
        width: 1200,
        height: 630,
        alt: "NEVERBE New Arrivals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "New Arrivals - Latest Shoes | NEVERBE",
    description: "Shop the newest sneakers & footwear in Sri Lanka.",
    images: ["https://neverbe.lk/logo-og.png"],
  },
};

const NewArrivalsPage = async () => {
  const { total, dataList } = await getNewArrivals(1, 20);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://neverbe.lk",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "New Arrivals",
            item: "https://neverbe.lk/collections/new-arrivals",
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: "New Arrivals - Latest Shoes Sri Lanka",
        description:
          "Shop the newest shoes in Sri Lanka. Latest sneakers, slides & footwear.",
        url: "https://neverbe.lk/collections/new-arrivals",
        inLanguage: "en-LK",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: dataList.length,
          itemListElement: dataList
            .slice(0, 15)
            .map((product: any, index: number) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Product",
                name: product.name,
                image:
                  product.thumbnail?.url || "https://neverbe.lk/logo-og.png",
                url: `https://neverbe.lk/collections/products/${product.id}`,
                brand: { "@type": "Brand", name: product.brand || "NEVERBE" },
                offers: {
                  "@type": "Offer",
                  priceCurrency: "LKR",
                  price: product.sellingPrice || "0.00",
                  availability: product.inStock
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                  itemCondition: "https://schema.org/NewCondition",
                },
              },
            })),
        },
      },
    ],
  };

  return (
    <main className="w-full min-h-screen bg-surface">
      {/* NEVERBE Performance Header */}
      <div className="w-full max-w-content mx-auto px-4 md:px-12 py-12 md:py-20 text-left">
        <h1 className="text-3xl md:text-5xl font-display font-black uppercase italic tracking-tighter text-primary leading-none mb-4">
          New Arrivals
        </h1>
        <p className="text-muted max-w-xl text-sm md:text-base font-medium uppercase tracking-wide">
          The latest heat. Fresh styles just added to the collection.
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <CollectionProducts
        initialItems={dataList}
        collectionType="new-arrivals"
        tagName="New Arrivals"
        total={total}
      />

      {/* SEO Footer */}
      <section className="bg-surface-2 py-16 mt-0">
        <div className="max-w-content mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24">
            <div className="max-w-sm">
              <h2 className="text-sm font-display font-black uppercase tracking-tight text-primary mb-6">
                Fresh Drops Weekly
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Stay with the trend. We update our collection with the latest
                releases from top global sneaker culture. 7A quality guaranteed.
              </p>
            </div>

            <div className="max-w-sm">
              <h3 className="text-sm font-display font-black uppercase tracking-tight text-primary mb-6">
                Trending Now
              </h3>
              <ul className="text-sm text-muted space-y-3 font-medium">
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Retro High Tops
                </li>
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Chunky Dad Shoes
                </li>
                <li className="hover:text-accent cursor-pointer transition-colors">
                  Minimalist Slides
                </li>
              </ul>
            </div>

            <div className="max-w-sm">
              <h3 className="text-sm font-display font-black uppercase tracking-tight text-primary mb-6">
                Limited Stock
              </h3>
              <p className="text-sm text-muted leading-relaxed">
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
