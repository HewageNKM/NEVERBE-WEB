import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "../style/globals.css";
import StoreProvider from "@/app/shop/components/StoreProvider";
import { SpeedInsights } from '@vercel/speed-insights/next';
import {Analytics} from "@vercel/analytics/react";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: {
        default: "NEVERBE - Quality Branded Copy Shoes in Sri Lanka.",
        template: "%s | NEVERBE - Quality Branded Copy Shoes in Sri Lanka.",
    },
    description: "Discover NEVERBE, your premier ecommerce destination for high-quality branded copy shoes and accessories in Sri Lanka. Enjoy a seamless shopping experience with fast delivery and exceptional customer service.",
    category: "Ecommerce",
    twitter: {
        images: [
            {
                url: "./assets/images/logo.png",
                alt: "NEVERBE_Logo",
            },
        ],
        card: "summary_large_image",
        site: "@neverbe",
        creator: "@neverbe",
        title: "NEVERBE - Quality Branded Copy Shoes in Sri Lanka.",
        description: "Discover NEVERBE, your premier ecommerce destination for high-quality branded copy shoes and accessories in Sri Lanka. Enjoy a seamless shopping experience with fast delivery and exceptional customer service.",
    },
    openGraph: {
        images: [
            {
                url: "https://neverbe.lk/api/og",
                alt: "NEVERBE_Logo",
                width: 260,
                height: 260,
            },
        ],
        type: "website",
        locale: "en_US",
        siteName: "NEVERBE",
        title: "NEVERBE - Quality Branded Copy Shoes in Sri Lanka.",
        description: "Discover NEVERBE, your premier ecommerce destination for high-quality branded copy shoes and accessories in Sri Lanka. Enjoy a seamless shopping experience with fast delivery and exceptional customer service.",
    },
    keywords: ["NEVERBE", "NEVERBE Sri Lanka", "NEVERBE Shoes", "NEVERBE Accessories", "NEVERBE Shop", "NEVERBE Online Shop", "NEVERBE Ecommerce", "NEVERBE Quality Shoes", "NEVERBE Quality Accessories", "NEVERBE Branded Shoes", "NEVERBE Branded Accessories", "NEVERBE Copy Shoes", "NEVERBE Copy Accessories", "NEVERBE Sri Lanka Shop", "NEVERBE Sri Lanka Online Shop", "NEVERBE Sri Lanka Ecommerce", "NEVERBE Sri Lanka Quality Shoes", "NEVERBE Sri Lanka Quality Accessories", "NEVERBE Sri Lanka Branded Shoes", "NEVERBE Sri Lanka Branded Accessories", "NEVERBE Sri Lanka Copy Shoes", "NEVERBE Sri Lanka Copy Accessories", "Nike Shoes Sri Lanka", "Adidas Shoes Sri Lanka", "New Balance Shoes Sri Lanka"],
}

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className="scroll-smooth">
        <body className={inter.className}>
        <StoreProvider>
            {children}
            <SpeedInsights />
            <Analytics />
        </StoreProvider>
        </body>
        </html>
    )
}
