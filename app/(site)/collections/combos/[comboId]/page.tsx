import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComboById } from "@/services/PromotionService";
import ComboHero from "./components/ComboHero";

const getCombo = cache(async (id: string) => {
  try {
    return await getComboById(id);
  } catch (e) {
    console.error(e);
    return null;
  }
});

export async function generateMetadata(context: {
  params: Promise<{ comboId: string }>;
}): Promise<Metadata> {
  const params = await context.params;
  const combo = await getCombo(params.comboId);

  if (!combo) {
    return {
      title: "Deal Not Found | NEVERBE",
      description: "The requested combo deal could not be found.",
      robots: { index: false, follow: true },
    };
  }

  const savings = combo.originalPrice - combo.comboPrice;

  return {
    title: `${combo.name} - Save Rs. ${savings} | NEVERBE`,
    description:
      combo.description ||
      `Get ${combo.name} bundle and save Rs. ${savings}. Limited time combo deal!`,
    openGraph: {
      title: `${combo.name} | NEVERBE Combo Deals`,
      description: `Save Rs. ${savings} with this exclusive combo deal.`,
      url: `https://neverbe.lk/collections/combos/${combo.id}`,
      images: [
        {
          url: combo.thumbnail?.url || "https://neverbe.lk/logo-og.png",
          width: 1200,
          height: 630,
          alt: combo.name,
        },
      ],
    },
  };
}

const ComboDetailPage = async (context: {
  params: Promise<{ comboId: string }>;
}) => {
  const params = await context.params;
  const combo = await getCombo(params.comboId);

  if (!combo) return notFound();

  // Build structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: combo.name,
    description: combo.description,
    image: combo.thumbnail?.url,
    offers: {
      "@type": "Offer",
      price: combo.comboPrice,
      priceCurrency: "LKR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main className="w-full relative mt-[80px] md:mt-[100px] min-h-screen px-4 md:px-8 bg-white text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ComboHero combo={combo} />
    </main>
  );
};

export default ComboDetailPage;
