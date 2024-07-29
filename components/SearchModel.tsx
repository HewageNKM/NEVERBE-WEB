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

const SearchModel = () => {
    const dispatch:AppDispatch = useDispatch();
    const arrivals = useSelector((state:RootState)=>state.arrivalsSlice.arrivals);
    useEffect(()=>{
        getArrivals();
    })
    return (
        <Backdrop containerStyles="w-[100%] z-50 fixed top-0 left-0 flex justify-end h-[100%] bg-opacity-70 bg-black">
            <motion.div className="bg-white relative w-[35vw] h-full z-50 p-5 rounded" initial={{opacity:0,x:'100vw'}} animate={{opacity:1, x:'0'}} transition={{type: "spring", damping: 28, stiffness: 200}} exit={{opacity:0,x:'100vw'}}>
                <h1 className="text-2xl font-bold">Search</h1>
                <div className="mt-2 flex flex-col gap-2 justify-start font-bold text-xl">
                    <FormField containerStyles="" otherStyles="p-2 w-full px-4" placeholder="Nike, Adidas, ......"/>
                    <h2 className="mt-3">New Arrivals</h2>
                    <div className="flex h-[90vh] flex-row gap-2 hide-scrollbar overflow-auto">
                        {arrivals.map((item, index) => (
                            <ShoeCard shoe={item} key={index}/>
                        ))}
                    </div>
                </div>
                <Button variant="text" className="text-black font-bold absolute top-0 -right-2" onClick={()=>{dispatch(closeSearchDialog())}}>
                    X
                </Button>
            </motion.div>
        </Backdrop>
    );
};

export default SearchModel;