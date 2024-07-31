import React from 'react';
import EmptyState from "@/components/EmptyState";

const Promotion = ({containerStyles}:{containerStyles:string}) => {
    return (
        <div className={`mt-10 w-full ${containerStyles}`}>
            <div className="flex w-full flex-col items-center justify-center">
               <h1 className="font-bold text-5xl ">
                   Sales and Promotions
               </h1>
                <div>
                    <p className="text-sm flex flex-wrap md:text-lg m-2 text-slate-500">
                        Get the best deals on our products
                    </p>
                </div>
                <div className="w-[60vw] h-[1.8px] bg-primary-100"/>
            </div>
            <div className="mt-10">
                <EmptyState title="Opps!" subTitle="No Sales and Promotions Available at the moment"/>
            </div>
        </div>
    );
};

export default Promotion;