'use client';
import React, {useEffect} from 'react';
import ShoeCard from "@/components/ShoeCard";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {getArrivals} from "@/lib/features/arrivalsSlice/arrivalSlice";

const Arrival = ({containerStyles}:{containerStyles:string}) => {
    const dispatch: AppDispatch = useDispatch();
    const arrival = useSelector((state: RootState) => state.arrivalsSlice.arrivals)
    useEffect(() => {
        dispatch(getArrivals)
    }, [dispatch])
    return (
        <div className={`mt-20 ${containerStyles}`}>
            <h1 className="font-bold text-4xl">New Arrival</h1>
            <div className="flex-col mt-16 justify-center items-center flex gap-10">
                <div className="flex-row justify-center flex-wrap flex gap-10 items-center">
                    {arrival.length > 0 ? arrival.map((item, index) => (
                        <ShoeCard key={index} title={item.name} thumbnail={item.thumbnail} color={item.color}
                                  sellingPrice={item.sellingPrice} type="new" shoeId={item.shoeId}/>
                    )) : (<EmptyState title="Opps!" subTitle="No New Arrivals"/>)}
                </div>
                {arrival.length > 20 && <Button title="Load More" containerStyles=""/>}
            </div>
        </div>
    );
};

export default Arrival;