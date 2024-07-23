import React from 'react';

const Promotion = ({containerStyles}:{containerStyles:string}) => {
    return (
        <div className={`mt-10 ${containerStyles}`}>
            <h1 className="font-bold text-4xl">
                Sales and Promotions
            </h1>
        </div>
    );
};

export default Promotion;