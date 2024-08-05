import React, {useEffect} from 'react';
import ShoeCard from "@/components/ShoeCard";
import EmptyState from "@/components/EmptyState";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {getSimilarProducts} from "@/lib/features/similarProductsSlice/similarProductsSlice";
import {Button} from "@mui/material";

const SimilarProducts = ({shoe, containerStyles}: { shoe: Shoe, containerStyles: string }) => {
    const dispatch: AppDispatch = useDispatch();
    const similarProducts:Shoe[] = useSelector((state: RootState) => state.similarProductsSlice.similarProducts);
    useEffect(() => {
        dispatch(getSimilarProducts(shoe?.for as string))
    }, [dispatch, shoe?.for])
    return (
        <div className={`mt-20 w-full ${containerStyles}`}>
            <h1 className="text-5xl font-bold">Similar Products</h1>
            <div className="flex flex-col gap-5 justify-center mt-10 items-center">
                <div className="flex-row justify-center flex-wrap flex gap-10 items-center">
                    {similarProducts?.length > 0 ? similarProducts.map((shoe, index) => (
                        <ShoeCard key={index} shoe={shoe}/>
                    )) : (<EmptyState title="Opps!" subTitle="No Similar Products"/>)}
                </div>
                <Button variant={"text"} color={"primary"}
                        className="text-primary mt-20 text-lg font-medium">
                    Load More
                </Button>
            </div>
        </div>
    );
};

export default SimilarProducts;