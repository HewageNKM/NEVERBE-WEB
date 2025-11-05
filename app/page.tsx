import React from 'react';
import Hero from "@/app/components/Hero";
import NewArrivals from "@/app/components/NewArrivals";
import WhyUs from "@/app/components/WhyUs";
import PopularProducts from "@/app/components/PopularProducts";
import FAQ from "@/app/components/FAQ";
import {Item, Slide} from "@/interfaces";
import BrandsSlider from './components/BrandsSlider';
import { getHotProducts, getRecentItems } from '@/services/ProductService';
import { getSliders } from '@/services/SlideService';
import { getBrands, getBrandsForDropdown } from '@/services/OtherService';

const Page = async () => {
    const arrivals: Item[] = [];
    const hotItems: Item[] = [];
    const sliders: Slide[] = [];
    const brands = [];

    try {
        arrivals.push(...await getRecentItems());
        sliders.push(...await getSliders());
        hotItems.push(...await getHotProducts());
        brands.push(...await getBrands());
    } catch (e) {
        console.error(e);
    }

    return (
        <>
            <Hero slides={sliders}/>
            <PopularProducts hotItems={hotItems}/>
            <NewArrivals arrivals={arrivals}/>
            <BrandsSlider items={brands}/>
            <WhyUs/>
            <FAQ/>
        </>
    );
};

export const dynamic = 'force-dynamic';
export default Page;