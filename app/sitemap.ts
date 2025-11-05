import { getBrandForSitemap, getProductsForSitemap } from '@/services/ProductService';
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    const allProducts = await getProductsForSitemap();
    const getBrands = await getBrandForSitemap();

    return [
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
            priority: 1,
            lastModified: new Date(),
            changeFrequency:"daily"
        },
        {
            url: `https://neverbe.lk/collections/products`,
            lastModified: new Date(),
            priority: 0.9,
            changeFrequency:"weekly"
        },
        ...allProducts,
        ...getBrands,
        {
            url: 'https://neverbe.lk/aboutUs',
            lastModified: new Date(),
            priority: 0.5,
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
            url: 'https://neverbe.lk/contact',
            lastModified: new Date(),
            priority: 0.3,
        },
    ];
}

export const dynamic = 'force-dynamic';
