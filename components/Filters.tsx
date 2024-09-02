import React from 'react';
import {accSizes, allSizes, menu, shoeSizes} from "@/constants";
import {FaArrowDown, FaArrowUp} from "react-icons/fa";
import Backdrop from "@/components/Backdrop";
import {motion} from "framer-motion"
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/store";
import {toggleFilter} from "@/lib/features/filterSlice/filterSlice";

const Filters = ({containerStyles,type}: { containerStyles: string,type:string }) => {

    const [expandedSizes, setExpandedSizes] = React.useState(false);
    const [expandedBrands, setExpandedBrands] = React.useState(false);
    const dispatch: AppDispatch = useDispatch();

    return (
        <Backdrop containerStyles="w-[100%] z-50 fixed top-0 left-0 flex justify-start  h-[100%] bg-opacity-70 bg-black">
            <motion.div className={`${containerStyles} relative mt-1 bg-white flex flex-row rounded-lg p-4 w-[95vw] md:w-[40vw] lg:w-[30vw] h-[98vh] justify-between`} initial={{opacity:0,x:'-100vw'}} animate={{opacity:1, x:'0'}} transition={{type: "spring", damping: 28, stiffness: 200}} exit={{opacity:0,x:'-100vw'}}>
                <div className="overflow-auto hide-scrollbar">
                    <div className="">
                        <h1 className="text-3xl font-bold">Filter</h1>
                        <div className="flex flex-col mt-5 gap-2 px-2">
                            <div>
                                <h3 className="font-medium text-2xl">
                                    Stock
                                </h3>
                                <div className="flex flex-row mt-2 gap-2">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" value="" className="sr-only peer" onClick={()=>{}}/>
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    </label>
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
                <div className="flex gap-2 w-fit h-fit absolute right-5">
                    <button className="bg-primary text-white rounded-md p-2">Clear</button>
                    <button className="bg-primary text-white rounded-md p-2">Apply</button>
                    <button className="text-xl font-medium" onClick={()=>dispatch(toggleFilter())}>
                        X
                    </button>
                </div>
            </motion.div>
        </Backdrop>
    );
};

export default Filters;