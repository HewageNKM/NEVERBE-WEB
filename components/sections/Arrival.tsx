'use client';
import React, {useEffect, useState} from 'react';
import {getNewArrival} from "@/firebase/Firebase";
import ShoeCard from "@/components/ShoeCard";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";

const Arrival = () => {
    const [arrival, setArrival] = useState([{}])
    const fetchNewArrival = async () => {
        const arrival = await getNewArrival();
        setArrival(arrival);
    }
    useEffect(() => {
        fetchNewArrival()
    },[])
    return (
        <div className="mt-20">
            <h1 className="font-bold text-3xl">New Arrival</h1>
            <div className="flex-col mt-16 justify-center items-center flex gap-10">
                <div className="flex-row justify-center flex-wrap flex gap-10 items-center">
                    {arrival.length > 0 ? arrival.map((item, index) => (
                        <ShoeCard key={index} title={item.description} thumbnail={item.thumbnail} color={item.color} sellingPrice={item.sellingPrice} type="new"/>
                    )):(<EmptyState title="Opps!" subTitle="No New Arrivals"/>)}
                </div>
                <Button title="Load More" containerStyles=""/>
            </div>
        </div>
    );
};

export default Arrival;