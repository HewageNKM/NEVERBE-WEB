import React from 'react';
import { brands } from "@/constants";

const Brands = () => {
    return (
        <section className="w-full bg-slate-100" aria-labelledby="brands-section">
            <h2 id="brands-section" className="text-center text-4xl md:text-5xl lg:text-6xl font-bold mt-3 mb-4">Our Brands</h2>
            <div className="p-8 mt-8">
                <ul className="flex w-full mt-5 flex-wrap gap-10 flex-row justify-center items-center" role="list">
                    {brands.map((item, index) => (
                        <li key={index} className="flex w-[22rem] flex-col justify-center items-center" role="listitem">
                            <h3 className="lg:text-5xl md:text-4xl text-3xl text-center">
                                <strong>{item.name}</strong>
                            </h3>
                            {/* Uncomment and add images if available */}
                            {/* <img src={item.logo} alt={`${item.name} logo`} className="mt-4 w-24 h-auto" /> */}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Brands;
