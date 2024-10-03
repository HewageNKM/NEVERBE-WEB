'use client'
import React, {useEffect, useState} from 'react';
import {useParams} from "next/navigation";
import {getItemById} from '@/firebase/serviceAPI';
import Image from "next/image";
import {Item, Variant} from "@/interfaces";
import {IoAdd, IoRemove} from "react-icons/io5";

const Page = () => {
    const [item, setItem] = useState({} as Item);
    const [selectedImage, setSelectedImage] = useState(item.thumbnail)
    const [selectedVariant, setSelectedVariant] = useState({} as Variant);
    const [selectedSize, setSelectedSize] = useState(null);
    const [qty, setQty] = useState(0)
    const {itemId} = useParams();
    useEffect(() => {
        getItemById(itemId).then((item) => {
            setItem(item);
            setSelectedImage(item.thumbnail);
        });
    }, [itemId]);

    const setQuantity = (direction: string) => {
        if (direction === "in") {
            if (selectedSize.stock > qty) {
                setQty(qty + 1)
            } else {
                setQty(selectedSize.stock)
            }
        } else if (direction === "dec") {
            if (qty == 0) {
                setQty(0)
            } else {
                setQty(qty - 1)
            }
        }
    }
    // Todo
    const addToCart = async () => {

    }
    return (
        <div className="w-full">
            <div className="px-8 py-4">
                <div className="grid md:grid-cols-2 grid-cols-1 gap-6 md:gap-10 mt-10">
                    <div className="flex flex-row gap-5">
                        <Image src={selectedImage} alt={item.name} width={300} height={300}
                               className="md:w-[35vw] md:h-[65vh] w-full h-[45vh] rounded-lg"/>
                        <div className="flex flex-col justify-center gap-5">
                            {selectedVariant?.images?.map((image, index) => (
                                <button onClick={() => setSelectedImage(image)} key={index}>
                                    <Image src={image} alt={item?.name} width={100} height={100}
                                           className="bg-cover w-[6rem] h-[6rem] rounded-lg"/>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="capitalize text-xl font-semibold text-slate-500">{item.manufacturer}</p>
                        <h1 className="text-4xl capitalize font-semibold">{item.name}</h1>
                        <div>
                            <p className="text-3xl text-red-500">{"Rs. " + item.sellingPrice}</p>
                            {item.discount > 0 &&
                                <p className="line-through text-lg text-gray-500">{"Rs. " + (item.sellingPrice + (item.sellingPrice * item.discount / 100)).toFixed(2)}</p>}
                        </div>
                        <div className="mt-2">
                            <h2 className="text-4xl text-yellow-400 font-medium">Colors</h2>
                            <div className="flex gap-6 mt-2 flex-row flex-wrap">
                                {item?.variants?.map((variant: Variant, index) => (
                                    <button onClick={() => {
                                        setSelectedVariant(variant)
                                        setSelectedImage(variant.images[0])
                                        setSelectedSize(null)
                                        setQty(0)
                                    }} key={index}
                                            className={`uppercase p-2 rounded-lg ${selectedVariant.variantId === variant.variantId ? "bg-primary" : "bg-slate-200"}`}>
                                        {variant.variantName}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-2">
                            <h2 className="text-4xl text-yellow-400 font-medium">Sizes</h2>
                            {selectedSize && <p className="text-slate-500">{selectedSize.stock + " Available"}</p>}
                            <div className="flex gap-6 mt-2 flex-row flex-wrap">
                                {selectedVariant?.sizes?.map((size, index) => (
                                    <button disabled={size.stock == 0} onClick={() => {
                                        setSelectedSize(size)
                                        setQty(0)
                                    }} key={index}
                                            className={`uppercase p-2 rounded-lg ${size.size == selectedSize?.size ? "bg-primary" : "bg-slate-200"}`}>
                                        {size.size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {selectedSize && (<div className="mt-2">
                            <h2 className="text-4xl text-yellow-400 font-medium">Quantity</h2>
                            <div className="flex gap-6 mt-2 flex-row flex-wrap">
                                <button onClick={() => setQuantity("dec")} className="bg-slate-200 p-2 rounded-full">
                                    <IoRemove/>
                                </button>
                                <p className="text-3xl">{qty}</p>
                                <button onClick={() => setQuantity("in")} className="bg-slate-200 p-2 rounded-full">
                                    <IoAdd/>
                                </button>
                            </div>
                        </div>)}
                        <div onClick={addToCart} className="mt-2 w-full flex justify-start">
                            <button className="bg-primary text-white p-2 rounded-2xl font-semibold w-full">Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;