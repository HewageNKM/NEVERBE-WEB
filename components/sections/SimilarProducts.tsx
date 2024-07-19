import React, {useEffect, useState} from 'react';
import {getSimilarProducts} from "@/firebase/Firebase";
import ShoeCard from "@/components/ShoeCard";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";

const SimilarProducts = ({shoe}: { shoe: object }) => {
    const [similarProducts, setSimilarProducts] = useState([]);
    const fetchSimilarProducts = async () => {
        const smlProducts = await getSimilarProducts(shoe.for,shoe.shoeId);
        setSimilarProducts(smlProducts)
    }
    useEffect(() => {
        fetchSimilarProducts()
    }, [shoe])
    return (
        <div className="mt-20 w-full">
            <h1 className="text-5xl font-bold">Similar Products</h1>
            <div className="flex flex-col gap-5 justify-center mt-10 items-center">
                <div className="flex-row justify-center flex-wrap flex gap-10 items-center">
                    {similarProducts?.length > 0 ? similarProducts.map((item, index) => (
                        <ShoeCard key={index} title={item.name} thumbnail={item.thumbnail} color={item.color}
                                  sellingPrice={item.sellingPrice} shoeId={item.shoeId}/>
                    )) : (<EmptyState title="Opps!" subTitle="No Popular"/>)}
                </div>
                <Button title="Load More" containerStyles=""/>
            </div>
        </div>
    );
};

export default SimilarProducts;