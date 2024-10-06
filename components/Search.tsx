import React from 'react';
import DropShadow from "@/components/DropShadow";
import {motion} from "framer-motion";
import {IoClose, IoSearch} from "react-icons/io5";

const Search = ({setShowSearch}:{setShowSearch:any}) => {
    const onSearch = async () => {

    }
    return (
        <DropShadow containerStyle="flex items-center flex-col pt-10">
            <motion.div
                initial={{ opacity: 0, y: "-100vh" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "-100vw" }}
                transition={{ type: "tween" ,duration: 0.4,delay: 0.1}}
                className="bg-white p-4 pt-10 w-[88vw] md:w-[50vw] lg:w-[30vw] h-fit rounded-lg relative">
                <form onSubmit={()=>{}} className="relative">
                    <legend className="text-lg text-primary font-bold">Type Name</legend>
                    <input type="text" placeholder="Search..." className="border-b-2 focus:outline-none mt-1 font-medium rounded-lg border-b-primary p-2 pr-10 w-full"/>
                    <button className="right-1 top-8 absolute">
                        <IoSearch size={30}/>
                    </button>
                </form>
                <button className="top-1 right-1 absolute">
                    <IoClose size={30} onClick={()=> setShowSearch(false)}/>
                </button>
            </motion.div>
        </DropShadow>
    );
};

export default Search;