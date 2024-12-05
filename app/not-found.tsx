import React from 'react';
import Link from "next/link";

const NotFound = () => {
    return (
        <div className="w-full relative flex flex-col justify-center items-center min-h-screen px-4">
            <div className="flex flex-col items-center">
                <h1 className="text-6xl lg:text-9xl font-extrabold text-red-600 animate-bounce">404</h1>
                <h2 className="mt-4 text-xl lg:text-4xl font-semibold text-gray-800 text-center">
                    Oops! We can&apos;t seem to find the page you&apos;re looking for.
                </h2>
                <p className="mt-2 text-gray-600 text-sm lg:text-xl text-center">
                    It might have been removed, or the link is broken.
                </p>
                <Link href="/">
                    <p className="mt-6 text-white bg-blue-500 hover:bg-blue-600 px-3 py-2 md:px-5 md:py-3 rounded-lg font-semibold text-lg transition-transform transform hover:scale-105">
                        Return to Home
                    </p>
                </Link>
            </div>
            <div className="absolute px-4 text-center bottom-20">
                <p className="text-gray-500 text-sm">
                    If you think this is a mistake, feel free to <a href="/contact" className="underline text-blue-500">contact us</a>.
                </p>
            </div>
        </div>
    );
};

export default NotFound;
