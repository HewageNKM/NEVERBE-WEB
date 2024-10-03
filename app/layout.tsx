import type {Metadata} from "next";
import {Roboto} from "next/font/google";
import "../style/globals.css";
import StoreProvider from "@/app/components/StoreProvider";
import GlobalProvider from "@/app/components/GlobalProvider";

const inter = Roboto({weight: "400", subsets: ["latin"]});

export const metadata: Metadata = {
    title: "NEVERBE",
    description: "Wearable Selling Ecommerce Website at affordable prices",
    category: "Ecommerce",
    keywords: ["shoes", "ecommerce", "fashion", "clothing", "accessories"],

}

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <StoreProvider>
            <GlobalProvider>
                {children}
            </GlobalProvider>
        </StoreProvider>
        </body>
        </html>
    )
}
