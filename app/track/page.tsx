import React from 'react';
import TrackForm from "@/app/track/components/TrackForm";
import Header from "@/app/track/components/Header";
import {Metadata} from "next";

export const metadata:Metadata = {
    title: "Track",
    twitter:{
        card: "summary",
        site: "@neverbe",
        creator: "@neverbe",
        title: "Track",
        description: "NEVERBE Track Your Order Status",
    },
    openGraph:{
        title: "Track",
        description: "NEVERBE Track Your Order Status",
        url: "https://neverbe.lk/track",
        type: "website",
        images: [
            {
                url: "https://neverbe.lk/api/og",
                width: 260,
                height: 260,
                alt: "NEVERBE_Logo",
            },
        ],
    },
}
const Page = () => {
    return (
        <main className="w-full h-full">
            <div className="p-8 flex flex-col justify-center items-center">
                <Header/>
                <TrackForm />
            </div>
        </main>
    );
};

export default Page;