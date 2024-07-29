import React from 'react';

const Accessories = ({containerStyles}:{containerStyles:string}) => {
    return (
        <div className={`mt-10 ${containerStyles}`}>
            <div className={`mt-20 ${containerStyles}`}>
                <div className="flex w-full flex-col items-center justify-center">
                    <h1 className="font-bold text-5xl ">
                        Accessories
                    </h1>
                    <div>
                        <p className="text-sm flex flex-wrap md:text-lg m-2 text-slate-500">
                            Get your favorite accessories here
                        </p>
                    </div>
                    <div className="w-[22vw] h-[1.8px] bg-primary-100"/>
                </div>
            </div>
        </div>
    );
};

export default Accessories;