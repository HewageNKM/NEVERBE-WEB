import type { MetadataRoute } from 'next'
import { getAllInventoryItems, getBrandsFromInventory } from "@/firebase/firebaseAdmin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    const items = await getAllInventoryItems();

    const allProducts = items.map((item) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/products/${item.itemId}`,
        lastModified: new Date(),
        priority: 0.8,
    }));

    const brands = await getBrandsFromInventory();

    const getBrands = brands.map((brand) => ({
        url: brand.url,
        lastModified: new Date(),
        priority: 0.8,
    }));

    // Flatten nested type URLs using flatMap
    const getTitles = brands.flatMap((brand) =>
        brand.types.map((type) => ({
            url: type.url,
            lastModified: new Date(),
            priority: 0.8,
        }))
    );

    return [
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
            priority: 1,
        },
        {
            url: `https://neverbe.lk/shop/products`,
            lastModified: new Date(),
            priority: 0.9,
        },
        ...allProducts,
        ...getBrands,
        ...getTitles,
        {
            url: 'https://neverbe.lk/policies/privacy-policy',
            priority: 0.5,
        },
        {
            url: 'https://neverbe.lk/policies/shipping-return-policy',
            lastModified: new Date(),
            priority: 0.5,
        },
        {
            url: 'https://neverbe.lk/policies/terms-conditions',
            lastModified: new Date(),
            priority: 0.5,
        },
        {
            url: 'https://neverbe.lk/contact',
            lastModified: new Date(),
            priority: 0.1,
        },
    ];
}

export const dynamic = 'force-dynamic';
