import React from 'react';

const SkeletonItemCard = () => {
    return (
        <div className="animate-pulse flex flex-col items-center">
            <div className="w-[12rem] h-[14rem] bg-gray-200 rounded-md"></div>
            <div className="w-[12rem] h-4 bg-gray-200 rounded-full mt-2"></div>
            <div className="w-[12rem] h-4 bg-gray-200 rounded-full mt-2"></div>
            <div className="w-[12rem] h-4 bg-gray-200 rounded-full mt-2"></div>
        </div>
    );
};

export default SkeletonItemCard;