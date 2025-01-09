import React from 'react';
import BrandCard from "@/app/components/BrandCard";

const Brands = ({brands}:{brands:any}) => {
    console.log(brands);
    return (
        <section className="w-full pb-10 pt-4 bg-slate-100" aria-labelledby="brands-section">
            <h2 id="brands-section"
                className="text-center text-2xl md:text-3xl lg:text-4xl font-bold md:mt-8 mt-4 mb-4">Shop By Brands</h2>
            <div className="p-8 mt-5">
                <ul className="flex w-full flex-wrap gap-10 flex-row justify-center items-center" role="list">
                    {brands.map((brand:any) => (
                        <li key={brand.id}>
                            <BrandCard brand={brand.name} url={brand.url}/>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Brands;
