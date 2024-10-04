import React from 'react';
import Link from "next/link";

const NotFound = () => {
    return (
        <div className="w-full justify-center items-center flex min-h-screen">
            <div className="px-8 py-8 flex justify-center items-center flex-col">
                <h1 className="text-9xl font-bold text-red-500 tracking-wider">404</h1>
                <h1 className="text-3xl font-normal text-red-400">Sorry, Item Couldn&apos;t Be Found !</h1>
                <Link href="/" className="text-blue-500 lg:hover:border-b-2 h-[1.8rem] border-b-blue-500 text-lg font-semibold mt-5">
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;