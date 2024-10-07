import React from 'react';
import TrackForm from "@/app/track/components/TrackForm";
import Header from "@/app/track/components/Header";

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