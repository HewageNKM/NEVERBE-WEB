"use client"
import { brands } from '@/constants';
import React from 'react';

const Brands = () => {
    return (
        <section className="w-full bg-slate-100" aria-labelledby="brands-section">
            <h2 id="brands-section"
                className="text-center text-2xl md:text-4xl lg:text-6xl font-bold md:mt-8 mt-4 mb-4">Our Brands</h2>
            <div className="p-8 mt-2">
                <ul className="flex w-full flex-wrap gap-10 flex-row justify-center items-center" role="list">
                    {brands.map((item, index) => (
                        <li key={index} className="flex w-[22rem] flex-col justify-center items-center" role="listitem">
                            <h3 className="lg:text-4xl md:text-3xl text-xl text-center">
                                <strong>{item.name}</strong>
                            </h3>
                            {/* Uncomment and add images if available
                             <img src={item.logo} alt={`${item.name} logo`} className="mt-4 w-24 h-auto" />*/}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Brands;
