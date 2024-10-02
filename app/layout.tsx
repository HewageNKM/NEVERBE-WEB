import type {Metadata} from "next";
import {Roboto} from "next/font/google";
import "../style/globals.css";
import StoreProvider from "@/app/components/StoreProvider";
import AuthProvider from "@/app/components/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Roboto({weight: "400", subsets: ["latin"]});

export const metadata: Metadata = {
    title: "NEVERBE",
    description: "Shoe Selling Ecommerce Website at affordable prices",
}

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <StoreProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </StoreProvider>
        </body>
        </html>
    )
}
