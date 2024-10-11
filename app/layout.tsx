import type {Metadata} from "next";
import {Lato} from "next/font/google";
import "../style/globals.css";
import StoreProvider from "@/app/components/StoreProvider";
import {SpeedInsights} from '@vercel/speed-insights/next';
import {Analytics} from "@vercel/analytics/react";
import GlobalProvider from "@/app/components/GlobalProvider";
import {seoKeywords} from "@/constants";

const lato = Lato({weight: "400", subsets: ["latin"]});

export const metadata: Metadata = {
    title: {
        default: "NEVERBE - Premium Branded Copy Shoes in Sri Lanka",
        template: "%s | NEVERBE - Premium Branded Copy Shoes in Sri Lanka",
    },
    metadataBase: new URL("https://neverbe.lk"),
    alternates: {
        canonical: "https://neverbe.lk",
    },
    description:
        "NEVERBE is Sri Lanka's premier online store for high-quality branded copy shoes and accessories. Shop from top brands with fast delivery.",
    category: "Ecommerce",
    keywords: seoKeywords,
    twitter: {
        card: "summary_large_image",
        site: "@neverbe",
        creator: "@neverbe",
        title: "NEVERBE - Premium Branded Copy Shoes in Sri Lanka",
        description:
            "NEVERBE is Sri Lanka's premier online store for high-quality branded copy shoes and accessories. Shop from top brands with fast delivery.",
        images: [
            {
                url: "https://neverbe.lk/api/og",
                alt: "NEVERBE Logo",
                width: 260,
                height: 260,
            },
        ],
    },
    openGraph: {
        url: "https://neverbe.lk",
        type: "website",
        locale: "en_US",
        siteName: "NEVERBE",
        title: "NEVERBE - Premium Branded Copy Shoes in Sri Lanka",
        description:
            "Discover NEVERBE, Sri Lanka's best ecommerce platform for branded copy shoes and accessories with fast delivery and superior service.",
        images: [
            {
                url: "https://neverbe.lk/api/og",
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
            <GlobalProvider>
                {children}
            </GlobalProvider>
            <SpeedInsights/>
            <Analytics/>
        </StoreProvider>
        </body>
        </html>
    )
}
