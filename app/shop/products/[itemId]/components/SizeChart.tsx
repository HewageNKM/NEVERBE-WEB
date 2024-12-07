import React from "react";
import {sizeData} from "@/constants";

const SizeChart = () => {
    return (
        <section className="mt-20" aria-labelledby="size-chart-heading">
            <h2 id="size-chart-heading" className="md:text-4xl text-2xl font-bold tracking-wider">
                Size Chart
            </h2>
            <div className="overflow-x-auto mt-5">
                <table className="table-auto border-collapse border border-gray-300 w-full text-sm md:text-base">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2 text-left">US - Women's</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">US - Men's</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">UK</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">CM</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">EU</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sizeData.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                            <td className="border border-gray-300 px-4 py-2">{row["US - Women's"]}</td>
                            <td className="border border-gray-300 px-4 py-2">{row["US - Men's"]}</td>
                            <td className="border border-gray-300 px-4 py-2">{row["UK"]}</td>
                            <td className="border border-gray-300 px-4 py-2">{row["CM"]}</td>
                            <td className="border border-gray-300 px-4 py-2">{row["EU"]}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default SizeChart;
