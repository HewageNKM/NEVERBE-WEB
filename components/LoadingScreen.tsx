import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="bg-white flex gap-10 flex-col justify-center items-center min-h-screen p-5">
            <h2 className="text-primary-100 text-xl md:text-2xl text-center font-light">© {new Date().getFullYear()} NEVERBE.
                All rights Reserved.</h2>
        </div>
    );
};

export default LoadingScreen;