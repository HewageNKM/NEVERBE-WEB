'use client';
import React, {useEffect, useState} from 'react';
import {getPopular} from "@/firebase/Firebase";
import ShoeCard from "@/components/ShoeCard";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";

const Popular = () => {
    const [popular, setPopular] = useState([{}])
    const fetchPopular = async () => {
        const popular = await getPopular();
        setPopular(popular);
    }
    useEffect(() => {
        fetchPopular()
    }, [])
    return (
        <div className="mt-20">
            <h1 className="font-bold text-3xl">Popular</h1>
            <div className="mt-3 flex flex-col gap-5 justify-center items-center">
                <div>
                    {popular.length > 0 ? popular.map((item, index) => (
                        <ShoeCard key={index} title={item.description} thumbnail={item.thumbnail} color={item.color} sellingPrice={item.sellingPrice} type="popular"/>
                    )):(<EmptyState title="Oops!" subTitle="No Shoes Found"/>)}
                </div>
                {popular && <Button title="Load More" containerStyles=""/>}
            </div>
        </div>
    );
};

export default Popular;