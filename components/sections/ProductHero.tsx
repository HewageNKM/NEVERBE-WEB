import React from 'react';
import {Button} from '@mui/material';
import {AiFillFilter} from "react-icons/ai";

const ProductHero = ({containerStyles}: { containerStyles: string }) => {
    return (
        <div className={`${containerStyles} mt-8 w-full flex-col flex gap-2`}>
            <div className="w-full">
                <h1 className="text-4xl font-bold">Products</h1>
                <h2 className="text-lg font-light">The best place to find the best products</h2>
            </div>
            <div className="w-full flex justify-between items-center">
                <div>
                    <Button className="text-primary gap-1 capitalize flex justify-center item-center">
                        <AiFillFilter size={25}/>
                        <p className="text-lg">
                            Filter
                        </p>
                    </Button>
                </div>
                <label className="flex flex-row gap-2 justify-center items-center">
                    <span className="font-medium text-lg">Sort By: </span>
                    <select className="text-primary font-bold p-1">
                        <option className="text-primary font-bold" value="az">A-Z</option>
                        <option className="text-primary font-bold" value="za">Z-A</option>
                        <option className="text-primary font-bold" value="lh">Low to High</option>
                        <option className="text-primary font-bold" value="hl">High to Low</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default ProductHero;