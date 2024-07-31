import React, {useEffect} from 'react';

const Products = ({containerStyles}:{containerStyles:string}) => {
    useEffect(()=>{

    })
    return (
        <div className={`${containerStyles} mt-3 w-full h-full`}>
            <div  className="flex-wrap flex gap-5 flex-row">
                Products
            </div>
        </div>
    );
};

export default Products;