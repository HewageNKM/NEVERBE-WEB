import React from 'react';
import {accSizes, allSizes, menu, shoeSizes} from "@/constants";
import {FaArrowDown, FaArrowUp} from "react-icons/fa";

const Filters = ({containerStyles,type}: { containerStyles: string,type:string }) => {

    const [expandedSizes, setExpandedSizes] = React.useState(false);
    const [expandedBrands, setExpandedBrands] = React.useState(false);
    return (
        <div className={`${containerStyles} relative mt-1 w-full h-full  flex flex-row justify-between`}>
            <div>
                <div className="">
                    <h1 className="text-3xl font-bold">Filter</h1>
                    <div className="flex flex-col mt-5 gap-2">
                        <div>
                            <h3 className="font-medium text-2xl">
                                In Stock
                            </h3>
                            <div className="flex flex-row mt-2 gap-2">
                                <input type="radio" name="inStock" id="inStock"/>
                                <label className="font-medium">Yes</label>
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-row gap-2">
                                <h3 className="font-medium text-2xl">
                                    Sizes
                                </h3>
                                <button onClick={() => setExpandedSizes(!expandedSizes)}>
                                    {expandedSizes ? (<FaArrowUp className="text-primary"/>) : (
                                        <FaArrowDown className="text-primary"/>)}
                                </button>
                            </div>
                            <ul className="mt-2">
                                {type === 'all' && expandedSizes && allSizes.map((size, index) => (
                                    <li key={index} className="flex-row flex gap-1">
                                        <input type="checkbox" name="size" id={size.toString()}/>
                                        <label className="font-medium">{size}</label>
                                    </li>
                                ))}
                                {type === 'shoe' && expandedSizes && shoeSizes.map((size, index) => (
                                    <li key={index} className="flex-row flex gap-1">
                                        <input type="checkbox" name="size" id={size.toString()}/>
                                        <label className="font-medium">{size}</label>
                                    </li>
                                ))}
                                {type == "acc" && expandedSizes && accSizes.map((size, index) => (
                                    <li key={index} className="flex-row flex gap-1">
                                        <input type="checkbox" name="size" id={size.toString()}/>
                                        <label className="font-medium">{size}</label>
                                    </li>
                                ))}
                                {/*{expandedSizes && shoeSizes.map((size, index) => (
                                    <li key={index} className="flex-row flex gap-1">
                                        <input type="checkbox" name="size" id={size.toString()}/>
                                        <label className="font-medium">{"Size " + size}</label>
                                    </li>
                                ))}*/}
                            </ul>
                        </div>
                        <div>
                            <div className="flex flex-row gap-2">
                                <h3 className="font-medium text-2xl">
                                    Brands
                                </h3>
                                <button onClick={() => setExpandedBrands(prevState => !prevState)}>
                                    {expandedBrands ? (<FaArrowUp className="text-primary"/>) : (
                                        <FaArrowDown className="text-primary"/>)}
                                </button>
                            </div>
                            <ul className="mt-2">
                                {expandedBrands && menu.map((menu, index) => (
                                    <li key={index} className="flex-row flex gap-1">
                                        <input type="checkbox" color={''} name={menu.title}
                                               id={menu.title.toString()}/>
                                        <label className="font-medium">{menu.title}</label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filters;