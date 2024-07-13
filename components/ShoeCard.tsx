import React from 'react';
import Image from "next/image";

const ShoeCard = ({title,thumbnail,sellingPrice,type,color}) => {
    return (
        <div className="flex hover:shadow cursor-pointer hover:scale-105 transition-all duration-300 relative p-2 flex-col w-[15rem]">
           <div>
                <Image src={thumbnail} alt="" className="w-full h-[40vh] bg-contain" width={2000} height={2000}/>
           </div>
            <div className="mt-2 flex flex-col gap-1">
                <div>
                    <h2 className="line-clamp-1 font-bold text-lg capitalize">{title || "Shoe"}</h2>
                </div>
                <div>
                    <h2 className="capitalize font-medium text-sm">Color: {color || "None"}</h2>
                </div>
                <div>
                    <h2 className="font-medium text-sm">Rs.{sellingPrice || 0}</h2>
                </div>
                <div>
                   <h2 className="line-clamp-1 font-medium text-sm">Pay Koko {(sellingPrice / 3).toFixed(2)} x 3</h2>
                </div>
            </div>
            {type === "new" &&
                <div className="bg-green-400 font-light absolute top-1 left-1 text-sm w-fit p-1">New</div>}
        </div>
    );
};

export default ShoeCard;