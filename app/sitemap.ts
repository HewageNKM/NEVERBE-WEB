import type { MetadataRoute } from 'next'
import {getInventory} from "@/firebase/serviceAPI";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    const items = await getInventory();

    const allProducts = items.map((item) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/products/${item.itemId}`,
        lastModified: new Date(),
        priority: 0.8,
    }));
    const uniqueManufacturers = new Set();
    const allProductsByManufacturer = items
        .filter(item => {
            if (uniqueManufacturers.has(item.manufacturer)) {
                return false;
            } else {
                uniqueManufacturers.add(item.manufacturer);
                return true;
            }
        })
        .map(item => ({
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/products/manufacturers/${item.manufacturer}`,
            lastModified: new Date(),
            priority: 0.8,
        }));
    const allProductsByManufacturersXBrands = items.map((item) => {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/shop/products/brands/${item.manufacturer}/${item.brand}`;
        return {
            url,
            lastModified: new Date(),
            priority: 0.8,
        }
    });
    return [
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
            priority: 1,
        },
        ... allProductsByManufacturer,
        ... allProductsByManufacturersXBrands,
        {
            url: `https://neverbe.lk/shop/products`,
            lastModified: new Date(),
            priority: 0.9,
        },
        ...allProducts,
        {
            url: `https://neverbe.lk/shop/checkout`,
            lastModified: new Date(),
        },

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
            url: 'https://neverbe.lk/track',
            lastModified: new Date(),
            priority: 0.5,
        },
        {
            url: 'https://neverbe.lk/down',
            lastModified: new Date(),
            priority: 0,
        }
    ]
}