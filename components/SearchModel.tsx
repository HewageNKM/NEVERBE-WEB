import React, {useEffect} from 'react';
import Backdrop from "@/components/Backdrop";
import {motion} from "framer-motion";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {Button} from "@mui/material";
import {closeSearchDialog} from "@/lib/features/headerSlice/headerSlice";
import {getArrivals} from "@/lib/features/arrivalsSlice/arrivalSlice";
import ShoeCard from "@/components/ShoeCard";
import FormField from "@/components/FormField";
import SearchCard from "@/components/SearchCard";

const SearchModel = () => {
    const dispatch:AppDispatch = useDispatch();
    const arrivals = useSelector((state:RootState)=>state.arrivalsSlice.arrivals);
    useEffect(()=>{
        getArrivals({l:20});
    })
    return (
        <Backdrop containerStyles="w-[100%] z-50 fixed top-0 left-0 flex justify-end h-[100%] bg-opacity-60 bg-black">
            <motion.div className="bg-white relative w-full lg:w-[30vw] h-full z-50 p-5 rounded" initial={{opacity:0,x:'100vw'}} animate={{opacity:1, x:'0'}} transition={{type: "spring", damping: 28, stiffness: 200}} exit={{opacity:0,x:'100vw'}}>
                <h1 className="text-2xl font-bold">Search</h1>
                <div className="mt-2 flex flex-col gap-2 justify-start font-bold text-xl">
                    <FormField containerStyles="" otherStyles="p-2 w-full px-4" placeholder="Nike, Adidas, ......"/>
                    <div className="overflow-auto mt-2">
                        <h2 className="mt-3">New Arrivals</h2>
                        <div className="flex mt-2 h-[90vh] gap-2 hide-scrollbar ">
                            <div className='flex w-full flex-col gap-5'>
                                {arrivals.map((item, index) => (
                                    <SearchCard shoe={item} key={index}/>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <Button variant="text" className="text-black font-bold absolute top-0 -right-2" onClick={() => {
                    dispatch(closeSearchDialog())
                }}>
                    X
                </Button>
            </motion.div>
        </Backdrop>
    );
};

export default SearchModel;