import React from 'react';
import ImagesSlider from "@/app/shop/components/ImagesSlider";
import {getSliders} from "@/firebase/serviceAPI";

const Hero = async () => {
    const sliders = await getSliders();
    return (
        <div className="w-full bg-slate-200 mt-32">
            <ImagesSlider images={sliders}/>
        </div>
    );
};

export default Hero;