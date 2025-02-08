import React from "react";

const Loading = () => {
    return (
        <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full lg:h-32 h-24 w-24 lg:w-32 border-t-4 border-b-4 border-primary"></div>
                <h1 className="lg:text-2xl text-xl font-bold mt-4 text-white">Loading...</h1>
            </div>
        </main>
    );
};

export default Loading;
