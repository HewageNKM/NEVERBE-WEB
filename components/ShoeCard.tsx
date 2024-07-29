import React, {useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import {Button, Rating} from "@mui/material";
import {motion} from "framer-motion";

const ShoeCard = ({shoe, type}: {
    shoe: object,
    type?: string
}) => {
    const [addToCart, setAddToCart] = useState(false);
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [selectedSize, setSelectedSize] = useState<number>(0);


    const setAvailableSizes = (size: number, index: number) => {
        const stocks = shoe.stocks;
        return <button key={index} onClick={() => {
            setSelectedSize(size)
        }}
                       className={`capitalize p-2 rounded-md ${selectedSize === size ? 'bg-primary text-white' : 'bg-gray-200 text-black'}     ${stocks[size] <= 0 && 'opacity-50'}`}
                       disabled={stocks[size] <= 0}>{size}</button>
    }
    return (
        <div onMouseEnter={() => setIsMouseOver(true)}
             onMouseLeave={() => {
                 setIsMouseOver(false)
             }}
             className="flex cursor-pointer transition-all duration-300 relative p-2 h-[25rem] flex-col w-[15rem]">
            <Link href={`/products/shoes/${shoe.shoeId}`} target='_blank'>
                <div>
                    <Image src={shoe.thumbnail} alt=""
                           className="w-full md:w-[15rem] rounded-lg h-[17rem] bg-contain" width={2000}
                           height={2000}/>
                </div>
                <div className="mt-2 flex flex-col gap-1">
                    <div>
                        <h2 className="line-clamp-1 font-bold text-lg capitalize">{shoe.manufacture}</h2>
                    </div>
                    <div>
                        <h2 className="line-clamp-1 text-slate-400 font-bold text-sm capitalize">{shoe.name}</h2>
                    </div>
                    <div className="flex text-lg flex-row justify-start gap-2 items-center">
                        <Rating size={"medium"} readOnly value={shoe?.rating} precision={0.1}/>
                        <p className="font-medium">{shoe.rating}</p>
                    </div>
                    <div className="flex flex-row gap-4 justify-start items-center">
                        <div className="relative w-fit">
                            <div className="h-[1.1px] absolute top-1/2 left-0 w-[4.2rem] bg-black"/>
                            <div className="flex flex-row items-center justify-center gap-3">
                                <h2 className="font-medium text-lg">රු {shoe.sellingPrice + 2000}</h2>
                                <p className="bg-red-600 text-sm p-[2px] rounded text-white">{-((2000 / (shoe.sellingPrice + 2000)) * 100).toFixed(2)}</p>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-primary">රු {shoe.sellingPrice}</h2>
                        </div>
                    </div>
                </div>
            </Link>
            {addToCart && (
                <div className="flex flex-col mt-2 justify-center items-center">
                    <div className="flex flex-row flex-wrap gap-1 text-sm">
                        {shoe.sizes?.map((size: number, index: number) => (
                            setAvailableSizes(size, index)
                        ))}
                    </div>
                    <div className='w-full mt-2 justify-between items-center gap-2 flex-row flex'>
                        <Button onClick={() => {
                            setAddToCart(false)
                            setSelectedSize(0)
                            setIsMouseOver(false)
                        }} className="bg-red-600 hover:bg-red-700 text-white w-[6rem]">Cancel</Button>
                        <Button onClick={() => {
                        }} variant="contained"
                                className="bg-primary w-[6rem] hover:bg-primary-100 text-white">Continue</Button>
                    </div>
                </div>
            )}
            {(isMouseOver && !addToCart) && (
                <motion.div className="lg:block hidden" initial={{opacity: 0, y: "2vh"}} animate={{opacity: 1, y: 0}}>
                    <Button onClick={() => setAddToCart(true)}
                            className="bg-primary hover:bg-primary-100 text-white mt-2 p-1 rounded-md w-full text-center">Add
                        to
                        Cart</Button>

                </motion.div>
            )}
            <Button onClick={() => setAddToCart(true)}
                    className="bg-primary block lg:hidden hover:bg-primary-100 text-white mt-2 p-1 rounded-md w-full text-center">Add
                to
                Cart</Button>
            {type === "new" &&
                <div
                    className="bg-green-400 font-light absolute text-white top-1 left-1 text-sm w-fit p-1">New</div>}
            {type === "popular" &&
                <div className="bg-red-500 font-light text-white absolute top-1 left-1 text-sm w-fit p-1">Hot</div>}
        </div>
    );
};

export default ShoeCard;