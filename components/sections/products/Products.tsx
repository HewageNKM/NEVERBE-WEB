import React, {useEffect} from 'react';

const Products = ({containerStyles}:{containerStyles:string}) => {
    useEffect(()=>{

    })
    return (
        <div className={`${containerStyles} relative  mt-3 w-full h-full  flex flex-row justify-between`}>
            <div className="">
                <h1 className="text-2xl font-semibold">Filter</h1>
                <div>
                </div>
            </div>
            <div  className="flex-wrap flex gap-5 flex-row">
                Products
            </div>
        </div>
    );
};

export default Products;