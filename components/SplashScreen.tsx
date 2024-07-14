import React from 'react';

const SplashScreen = ({containerStyles}: { containerStyles: string }) => {
    return (
        <div className={`animate-pulse flex justify-between items-center space-x-4 ${containerStyles}`}>
            <div className="flex-1 p-4 space-y-6 justify-between">
                <div className="h-2 bg-slate-200 rounded "></div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded "></div>
                <div className="h-2 bg-slate-200 rounded "></div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded "></div>
                <div className="h-2 bg-slate-200 rounded "></div>
            </div>
        </div>
    );
};

export default SplashScreen;