import React, {useEffect} from 'react';
import ShoeCard from "@/components/ShoeCard";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {getSimilarProducts} from "@/lib/features/similarProductsSlice/similarProductsSlice";

const SimilarProducts = ({shoe,containerStyles}: { shoe: object, containerStyles:string}) => {
    const dispatch: AppDispatch = useDispatch();
    const similarProducts = useSelector((state: RootState) => state.similarProductsSlice.similarProducts);
    useEffect(() => {
        dispatch(getSimilarProducts(shoe?.for as string))
    }, [dispatch, shoe?.for])
    return (
        <div className={`mt-20 w-full ${containerStyles}`}>
            <h1 className="text-5xl font-bold">Similar Products</h1>
            <div className="flex flex-col gap-5 justify-center mt-10 items-center">
                <div className="flex-row justify-center flex-wrap flex gap-10 items-center">
                    {similarProducts?.length > 0 ? similarProducts.map((item, index) => (
                        <ShoeCard key={index} title={item.name} thumbnail={item.thumbnail} color={item.color}
                                  sellingPrice={item.sellingPrice} shoeId={item.shoeId}/>
                    )) : (<EmptyState title="Opps!" subTitle="No Similar Products"/>)}
                </div>
                <Button title="Load More" containerStyles=""/>
            </div>
        </div>
    );
};

export default SimilarProducts;