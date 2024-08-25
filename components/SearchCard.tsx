import React from 'react';
import Image from "next/image";
import Link from "next/link";

const SearchCard = ({shoe}:{shoe:Shoe}) => {
    return (
        <Link href={`/products/shoes/`+shoe.shoeId} className="flex flex-row  gap-5 justify-start hover:bg-primary-50 pr-2 rounded w-full items-center">
            <div>
                <Image src={shoe.thumbnail} alt={shoe.thumbnail} width={200} height={200} className="w-20 rounded h-20 bg-contain"/>
            </div>
            <div className="flex flex-col">
                <div className="flex-row flex justify-center items-center gap-2">
                    <h1 className="font-bold text-lg capitalize">
                        {shoe.manufacturer}
                    </h1>
                    <p className="text-sm text-slate-500 capitalize">
                        {shoe.brand}
                    </p>
                </div>
                <div className="flex justify-center items-center gap-1 flex-row">
                    <p className="text-sm capitalize">
                        <h2 className="font-medium text-lg">රු {((shoe.discount + 100) * shoe.sellingPrice / 100)}</h2>
                    </p>
                    <p className="bg-red-600 w-fit text-sm px-1 rounded text-white">-{shoe.discount}</p>
                </div>
            </div>
        </Link>
    );
};

export default SearchCard;