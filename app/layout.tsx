import type {Metadata} from "next";
import {Lato} from "next/font/google";
import "../style/globals.css";
import StoreProvider from "@/app/shop/components/StoreProvider";
import { SpeedInsights } from '@vercel/speed-insights/next';
import {Analytics} from "@vercel/analytics/react";

const lato = Lato({weight:"400",subsets:["latin"]});

export const metadata: Metadata = {
    title: {
        default: "NEVERBE - Premium Branded Copy Shoes in Sri Lanka",
        template: "%s | NEVERBE - Premium Branded Copy Shoes in Sri Lanka",
    },
    metadataBase: new URL("https://neverbe.lk"),
    alternates: {
        canonical: "https://neverbe.lk/",
    },
    description:
        "NEVERBE is Sri Lanka's premier online store for high-quality branded copy shoes and accessories. Shop from top brands with fast delivery and excellent customer support.",
    category: "Ecommerce",
    keywords: [
        "NEVERBE", "NEVERBE Sri Lanka", "NEVERBE Shoes", "Branded Copy Shoes Sri Lanka",
        "Adidas Sri Lanka", "Nike Sri Lanka", "Copy Shoes Sri Lanka", "Fashion Accessories Sri Lanka",
        "Online Shop Sri Lanka", "Quality Shoes Sri Lanka", "Ecommerce Sri Lanka"
    ],
    twitter: {
        card: "summary_large_image",
        site: "@neverbe",
        creator: "@neverbe",
        title: "NEVERBE - Premium Branded Copy Shoes in Sri Lanka",
        description:
            "NEVERBE is Sri Lanka's top destination for branded copy shoes. Enjoy seamless shopping with fast shipping and quality service.",
        images: [
            {
                url: "https://neverbe.lk/assets/images/logo.png",
                alt: "NEVERBE Logo",
                width: 260,
                height: 260,
            },
        ],
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "NEVERBE",
        title: "NEVERBE - Premium Branded Copy Shoes in Sri Lanka",
        description:
            "Discover NEVERBE, Sri Lanka's best ecommerce platform for branded copy shoes and accessories with fast delivery and superior service.",
        images: [
            {
                url: "https://neverbe.lk/assets/images/logo.png",
                alt: "NEVERBE Logo",
                width: 260,
                height: 260,
            },
        ],
    },
}

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className="scroll-smooth">
        <body className={lato.className}>
        <StoreProvider>
            {children}
            <SpeedInsights />
            <Analytics />
        </StoreProvider>
        </body>
        </html>
    )
}
