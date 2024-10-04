import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "../style/globals.css";
import StoreProvider from "@/app/shop/components/StoreProvider";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: {
        default: "NEVERBE",
        template: "%s - NEVERBE",
    },
    description: "NEVERBE is a Ecommerce website, where you can buy your branded copy shoes and related accessories in Sri Lanka.",
    category: "Ecommerce",
}

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <StoreProvider>
            {children}
        </StoreProvider>
        </body>
        </html>
    )
}
