import type { MetadataRoute } from 'next'
import {getInventory} from "@/firebase/serviceAPI";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    const items = await getInventory();

    const paths = items.map((item) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/products/${item.itemId}`,
        lastModified: new Date(),
        priority: 0.8,
    }));
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
        {
            url: `https://neverbe.lk/shop/checkout`,
            lastModified: new Date(),
        },
        {
            url: `https://neverbe.lk/account`,
            lastModified: new Date(),
        },
        ...paths,
        {
            url: 'https://neverbe.lk/policies/privacy-policy',
            priority: 0.5,
        },
        {
            url: 'https://neverbe.lk/policies/shipping-return-policy',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: 'https://neverbe.lk/policies/terms-conditions',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]
}