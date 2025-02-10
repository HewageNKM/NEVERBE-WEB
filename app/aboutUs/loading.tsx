import React from "react";

const Loading = () => {
    return (
        <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
            <div className="absolute w-full h-full inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-30">
                <div className="w-12 h-12 border-4 border-t-4 border-gray-300 border-t-primary-100 rounded-full animate-spin"></div>
            </div>
        </main>
    );
};

export default Loading;
