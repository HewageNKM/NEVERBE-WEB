'use client';
import React, {useEffect, useState} from 'react';
import {getPopular} from "@/firebase/Firebase";
import ShoeCard from "@/components/ShoeCard";

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
        <div className="mt-8">
            <h1 className="font-bold text-3xl">Popular</h1>
            <div className="mt-3">
                {popular && popular.map((item, index) => (
                    <ShoeCard key={index}/>
                ))}
            </div>
        </div>
    );
};

export default Popular;