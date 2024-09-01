'use client';
import React, {useEffect} from 'react';
import ShoeCard from "@/components/ShoeCard";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {getArrivals} from "@/lib/features/arrivalsSlice/arrivalSlice";

const Popular = ({containerStyles}: { containerStyles: string }) => {
    const dispatch: AppDispatch = useDispatch();
    const popular = useSelector((state: RootState) => state.arrivalsSlice.arrivals)
    useEffect(() => {
        dispatch(getArrivals({l:20}))
    }, [dispatch])
    return (
        <div className={`mt-20 ${containerStyles}`}>
            <div className="flex w-full flex-col items-center justify-center">
                <h1 className="font-bold text-5xl ">
                    Popular
                </h1>
                <div>
                    <p className="text-sm flex flex-wrap md:text-lg m-2 text-slate-500">
                       Blend in with people&apos;s choice of shoes
                    </p>
                </div>
                <div className="w-[60vw] h-[1.8px] bg-primary-100"/>
            </div>
            <div className="flex-col mt-8 justify-center items-center flex gap-10">
                <div className="flex-row justify-center flex-wrap lg:gap-20 flex gap-28 items-center">
                    {popular.length > 0 ? popular.map((shoe, index) => (
                        <ShoeCard key={index} shoe={shoe} type="popular"/>
                    )) : (<EmptyState title="Opps!" subTitle="No Popular"/>)}
                </div>
                {popular.length > 20 && <Button title="Load More" containerStyles=""/>}
            </div>
        </div>
    );
};

export default Popular;