import React, {useState} from 'react';
import Image from "next/image";
import {MdArrowBackIos, MdArrowForwardIos} from "react-icons/md";
import {Skeleton} from "@mui/material";

const ShoeDetails = ({shoe}: { shoe: object }) => {
    const [selectedSlide, setSelectedSlide] = useState("")
    const [available, setAvailable] = useState(0);
    const [selectedSize, setSelectedSize] = useState(0);
    const [qty, setQty] = useState(0);


    const setQuantity = (action: string) => {
        if (action === "f") {
            if (qty + 1 > shoe.stocks[selectedSize]) return;
            setQty(qty + 1);
            setAvailable((prevState) => prevState - 1)
        } else if (action === "b") {
            if (qty <= 0) return;
            setQty(qty - 1);
            setAvailable((prevState) => prevState + 1)
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
                {shoe.thumbnail ? (<Image src={selectedSlide || shoe.thumbnail} width={2000} height={2000}
                                          className="w-full shadow rounded-sm bg-contain h-[60vh] md:h-[90vh]"
                                          alt={shoe.description}/>) : (
                    <Skeleton animation="wave" sx={{background: "rgb(243 244 246)", width: '100%', height: '70%'}}/>)}
                <div className="flex mt-3 flex-row gap-4 justify-center items-center w-full">
                    {shoe.images?.map((url: string, index: number) => (
                        <button key={index} value={url} onClick={() => setSelectedSlide(url)}>
                            <Image src={url}
                                   className={`bg-cover w-20 h-20 rounded ${selectedSlide == url && 'border-[1.5px] transition-all duration-300 scale-110 border-black '}`}
                                   alt={`${index}`} width={1000} height={1000}/>
                        </button>

                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-2 justify-start">
                <div className="mt-20 md:mt-0">
                    <h1 className="md:text-3xl text-2xl font-bold capitalize">{shoe.manufacture || "NeverBe"}</h1>
                    <p className="md:text-2xl text-xl capitalize">{shoe.name ||
                        <Skeleton animation="wave" sx={{background: "rgb(243 244 246)", width: '5rem'}}/>}</p>
                </div>
                <p className="text-sm text-gray-500 flex flex-wrap capitalize">{shoe.description ||
                    <Skeleton animation="wave"
                              sx={{background: "rgb(243 244 246)", width: '100%', height: '12rem'}}/>}</p>
                <h4 className="md:text-lg capitalize font-medium">{shoe.color ||
                    <Skeleton animation="wave" sx={{background: "rgb(243 244 246)", width: '5rem'}}/>}</h4>
                <div className="mt-2 flex-col flex gap-1">
                    <h3 className="md:text-2xl text-xl font-medium">රු {shoe.sellingPrice ||
                        <Skeleton animation="wave" sx={{background: "rgb(243 244 246)", width: '5rem'}}/>}</h3>
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
                        <button onClick={() => setQuantity("b")}
                                className={`bg-gray-200 rounded-full p-2 ${!selectedSize ? 'opacity-50' : 'hover:bg-gray-300'}`}
                                disabled={!selectedSize}>
                            <MdArrowBackIos/>
                        </button>
                        <p className="font-medium text-xl">{qty}</p>
                        <button onClick={() => setQuantity("f")}
                                className={`bg-gray-200 rounded-full p-2 ${!selectedSize ? 'opacity-50' : 'hover:bg-gray-300'}`}
                                disabled={!selectedSize}>
                            <MdArrowForwardIos/>
                        </button>
                    </div>
                    <div className="mt-5 flex justify-center items-center">
                        <button disabled={qty <= 0} onClick={() => addToCart()}
                                className={`bg-black w-full text-lg leading-5 tracking-wide font-medium text-white rounded-md p-3 ${qty <= 0 ? 'opacity-40' : 'bg-gray-950'}`}>Add
                            to
                            Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoeDetails;