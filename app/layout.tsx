import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "../style/globals.css";
import StoreProvider from "@/app/shop/components/StoreProvider";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: {
        default: "NEVERBE - Quality Branded Copy Shoes in Sri Lanka.",
        template: "%s | NEVERBE - Quality Branded Copy Shoes in Sri Lanka.",
    },
    description: "Discover NEVERBE, your premier ecommerce destination for high-quality branded copy shoes and accessories in Sri Lanka. Enjoy a seamless shopping experience with fast delivery and exceptional customer service.",
    category: "Ecommerce",
    keywords: ["NEVERBE", "NEVERBE Sri Lanka", "NEVERBE Shoes", "NEVERBE Accessories", "NEVERBE Shop", "NEVERBE Online Shop", "NEVERBE Ecommerce", "NEVERBE Quality Shoes", "NEVERBE Quality Accessories", "NEVERBE Branded Shoes", "NEVERBE Branded Accessories", "NEVERBE Copy Shoes", "NEVERBE Copy Accessories", "NEVERBE Sri Lanka Shop", "NEVERBE Sri Lanka Online Shop", "NEVERBE Sri Lanka Ecommerce", "NEVERBE Sri Lanka Quality Shoes", "NEVERBE Sri Lanka Quality Accessories", "NEVERBE Sri Lanka Branded Shoes", "NEVERBE Sri Lanka Branded Accessories", "NEVERBE Sri Lanka Copy Shoes", "NEVERBE Sri Lanka Copy Accessories","Nike Shoes Sri Lanka","Adidas Shoes Sri Lanka","New Balance Shoes Sri Lanka"],
}

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className="scroll-smooth">
        <body className={inter.className}>
        <StoreProvider>
            {children}
        </StoreProvider>
        </body>
        </html>
    )
}
