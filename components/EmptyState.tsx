import React from 'react';

const EmptyState = ({title,subTitle}) => {
    return (
        <div className="w-full flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-gray-500">{title}</h1>
            <p className="text-lg font-medium">{subTitle}</p>
        </div>
    );
};

export default EmptyState;