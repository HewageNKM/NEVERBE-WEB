import React from 'react';
import Image from "next/image";

const SizeChart = ({ image }: { image: string }) => {
    return (
        <section className="mt-20" aria-labelledby="size-chart-heading">
            <h2 id="size-chart-heading" className="md:text-4xl text-2xl font-bold tracking-wider">Size Chart</h2>
            <div className="flex justify-center items-center mt-5">
                <Image
                    src={image}
                    alt="Size chart for product measurements"
                    width={300}
                    height={300}
                    className="lg:w-[70vw] md:w-[90vw] w-full h-fit bg bg-cover rounded-lg"
                    loading="lazy" // Lazy loading for better performance
                />
            </div>
        </section>
    );
};

export default SizeChart;
