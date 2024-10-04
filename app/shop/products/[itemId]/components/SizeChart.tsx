import React from 'react';
import Image from "next/image";

const SizeChart = ({image}: { image: any }) => {
    return (
        <div className="mt-20">
            <h1 className="md:text-4xl text-2xl font-bold tracking-wider">Size Chart</h1>
            <div className="flex justify-center items-center mt-5">
                <Image src={image} alt={"sizes"} width={300} height={300}
                       className="lg:w-[70vw] md:w-[80vw] w-full h-fit bg bg-cover rounded-lg"/>
            </div>
        </div>
    );
};

export default SizeChart;