import React, {useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import SplashScreen from "@/components/SplashScreen";
import {MdArrowBackIos, MdArrowForwardIos} from "react-icons/md";

const ShoeDetails = ({shoe}: { shoe: object }) => {
    const [available, setAvailable] = useState(0);
    const [selectedSize, setSelectedSize] = useState(0);
    const [qty, setQty] = useState(0);
    const setQuantity = (action: string) => {
        if (action === "f") {
            if(qty + 1 > available) return;
            setQty(qty + 1);
        } else if(action === "b"){
            if(qty <= 0) return;
            setQty(qty - 1);
        }
    }
    const getAvailable = (size: number, index: number) => {
        const stocks = shoe.stocks;
        return <button key={index} onClick={() => {
            setSelectedSize(size);
            setAvailable(stocks[size]);
        }}
                       className={`capitalize p-2 rounded-md ${selectedSize === size ? 'bg-black text-white' : 'bg-gray-200 text-black'}     ${stocks[size] <= 0 && 'opacity-50'}`}
                       disabled={stocks[size] <= 0}>{size}</button>
    }
    const addToCart = () => {
        alert(`Added ${qty} ${shoe.name} to cart`)
    };
    return (
        <div
            className="w-full relative mt-20 lg:mt-12 flex flex-col md:grid md:grid-cols-2 justify-center lg:flex-row gap-10 lg:gap-20 ">
            <div className="h-[60vh] md:h-[90vh] w-full">
                {shoe.thumbnail ? (<Image src={shoe.thumbnail} width={2000} height={2000}
                                          className="w-full bg-contain h-[60vh] md:h-[90vh]"
                                          alt={shoe.description}/>) : (
                    <SplashScreen containerStyles="w-full h-[90vh] md:h-[60vh]"/>)}
            </div>
            <div className="flex flex-col gap-2 justify-start">
                <div>
                    <h1 className="md:text-3xl text-2xl font-bold capitalize">{shoe.manufacture || "NeverBe"}</h1>
                    <p className="md:text-2xl text-xl capitalize">{shoe.name || "NeverBe"}</p>
                </div>
                <p className="text-sm text-gray-500 flex flex-wrap capitalize">{shoe.description || "NeverBe"}</p>
                <h4 className="md:text-lg capitalize font-medium">{shoe.color || "None"}</h4>
                <div className="mt-2 flex-col flex gap-1">
                    <h3 className="md:text-2xl text-xl font-medium">Rs.{shoe.sellingPrice || 0}</h3>
                    <p className="text-sm text-gray-500 capitalize font-medium">{available} available</p>
                </div>
                <div className="mt-1">
                    <h3 className="text-lg font-medium">Size</h3>
                    <div className="flex mt-1 flex-row gap-3 flex-wrap ">
                        {shoe.sizes?.map((size: number, index: number) => (
                            getAvailable(size, index)
                        ))}
                    </div>
                </div>
                <div className="w-full mt-1">
                    <h3 className="text-lg font-medium">Quantity</h3>
                    <div className="flex gap-4 items-center justify-start w-fit flex-row mt-1">
                        <button onClick={()=> setQuantity("b")} className={`bg-gray-200 rounded-full p-2 ${!selectedSize ? 'opacity-50' :'hover:bg-gray-300'}`} disabled={!selectedSize}>
                            <MdArrowBackIos/>
                        </button>
                        <p className="font-medium text-xl">{qty}</p>
                        <button onClick={()=> setQuantity("f")}  className={`bg-gray-200 rounded-full p-2 ${!selectedSize ? 'opacity-50':'hover:bg-gray-300'}`} disabled={!selectedSize}>
                            <MdArrowForwardIos/>
                        </button>
                    </div>
                    <div className="mt-5 flex justify-center items-center">
                        <button disabled={qty<= 0} onClick={()=>addToCart()} className={`bg-black w-full text-lg leading-5 tracking-wide font-medium text-white rounded-md p-3 ${qty<= 0 ? 'opacity-40':'bg-gray-950'}`}>Add
                            to
                            Cart
                        </button>
                    </div>
                </div>
            </div>
            <div className="capitalize font-medium text-[8px] md:text-sm absolute -top-3 md:-top-5 md:left-0">
                <p>
                    <Link href="/">Home</Link> &gt; Product &gt; <Link className="uppercase" href={`/product/${shoe.shoeId}`}>{shoe.shoeId}</Link>
                </p>
            </div>
        </div>
    );
};

export default ShoeDetails;