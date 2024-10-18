"use client"
import React, {useEffect, useState} from 'react';
import Image from "next/image";
import {CartItem, Item, Size, Variant} from "@/interfaces";
import {IoAdd, IoRemove} from "react-icons/io5";
import {AppDispatch} from "@/redux/store";
import {useDispatch} from "react-redux";
import {pushToCart} from "@/redux/cartSlice/cartSlice";
import Skeleton from "@/components/Skeleton";

const ProductHero = ({item}: { item: Item }) => {
    const [selectedImage, setSelectedImage] = useState(item.thumbnail)
    const [selectedVariant, setSelectedVariant] = useState<Variant>({
        variantId: "",
        variantName: "",
        images: [],
        sizes: []
    });
    const [selectedSize, setSelectedSize] = useState<Size>({size: "", stock: 0});
    const [qty, setQty] = useState(0)
    const [outOfStocks, setOutOfStocks] = useState(false);
    const [outOfStocksLabel, setOutOfStocksLabel] = useState("Out of Stock");


    const dispatch: AppDispatch = useDispatch();

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
    const addToCart = async () => {
        const cartItem: CartItem = {
            itemId: item.itemId,
            variantId: selectedVariant.variantId,
            name: item.name,
            variantName: selectedVariant.variantName,
            thumbnail: selectedVariant.images[0],
            size: selectedSize.size,
            quantity: qty,
            type: item.type,
            price: item.sellingPrice
        }

        dispatch(pushToCart(cartItem))
        reset()
    }
    const reset = () => {
        setSelectedVariant({variantId: "", variantName: "", images: [], sizes: []})
        setSelectedSize({size: "", stock: 0})
        setQty(0)
        setSelectedImage(item.thumbnail)
    }
    const checkOutOfStocks = () => {
        if (item.variants.length === 0) {
            setOutOfStocks(true);
            setOutOfStocksLabel("Coming Soon");
            return;
        }
        let iCount = 0;
        for (let i = 0; i < item.variants.length; i++) {
            let vCount = 0;
            for (let j = 0; j < item.variants[i].sizes.length; j++) {
                if (item.variants[i].sizes[j].stock == 0) {
                    vCount++;
                }
            }
            if (vCount === item.variants[i].sizes.length) {
                iCount++;
            }
        }

        if (iCount === item.variants.length) {
            setOutOfStocks(true);
        }
    }
    useEffect(() => {
        checkOutOfStocks();
    }, [item]);
    return (
        <section className="w-full relative">
            <h1 className="md:text-4xl text-2xl tracking-wider mt-10"><strong>{item.name.toUpperCase() || "Product"} Portfolio</strong></h1>
            <article className="grid md:grid-cols-2 grid-cols-1 gap-6 md:gap-10 mt-10">
                <div className="flex flex-row items-center justify-center flex-wrap gap-5">
                    <Image src={selectedImage} alt={item.name} width={300} height={300}
                           className={"md:w-[40vw] md:h-[65vh] w-full h-[45vh] rounded-lg"}/>
                    <ul className="flex flex-row justify-center gap-5">
                        {selectedVariant.images.map((image: string, index: number) => (
                            <li key={index}>
                                <button onClick={() => setSelectedImage(image)}
                                        className={`${selectedImage == image && "border-primary border-4 rounded-lg"}`}>
                                    <figure>
                                        <Image src={image} alt={item?.name} width={100} height={100}
                                               className="bg-cover w-[6rem] h-[6rem] rounded-lg"/>
                                    </figure>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex flex-col gap-1">
                    {item ? (
                        <p className="text-xl capitalize font-semibold text-slate-500">{item?.manufacturer}</p>) : (
                        <Skeleton containerStyles="w-[5rem] h-[2rem]"/>)}
                    {item ? (<h2 className="text-4xl font-bold text-primary capitalize">{item?.name}</h2>) : (
                        <Skeleton containerStyles="w-[10rem] h-[2rem]"/>)}
                    <div>
                        {item ? (<p className="text-3xl text-red-500">{"Rs. " + (item?.sellingPrice)}</p>) : (
                            <Skeleton containerStyles="w-[5rem] h-[2rem]"/>)}
                        {item?.discount > 0 &&
                            <p className="line-through text-lg text-gray-500">{"Rs. " + (item?.sellingPrice + (item?.sellingPrice * item?.discount / 100)).toFixed(2)}</p>}
                    </div>
                    <div className="mt-2">
                        <h2 className="text-4xl text-yellow-400 font-medium">Colors</h2>
                        <ul className="flex gap-6 mt-2 flex-row flex-wrap">
                            {item ? (item?.variants?.map((variant: Variant, index) => (
                                <li key={index}>
                                    <button onClick={() => {
                                        setSelectedVariant(variant)
                                        setSelectedImage(variant.images[0])
                                        setSelectedSize({size: "", stock: 0})
                                        setQty(0)
                                    }}
                                            className={`uppercase p-2 rounded-lg ${selectedVariant?.variantId === variant.variantId ? "bg-primary" : "bg-slate-200"}`}>
                                        {variant.variantName}
                                    </button>
                                </li>

                            ))) : (<li><Skeleton containerStyles="w-full h-[15vh]"/></li>)}
                        </ul>
                    </div>
                    <div className="mt-2">
                        <h2 className="text-4xl text-yellow-400 font-medium">Sizes</h2>
                        {selectedSize &&
                            <p className="text-slate-500">{(selectedSize?.stock || 0) + " Available"}</p>}
                        <ul className="flex gap-6 mt-2 flex-row flex-wrap">
                            {selectedVariant?.sizes?.map((size, index) => (
                                <li key={index}>
                                    <button disabled={size.stock == 0} onClick={() => {
                                        setSelectedSize(size)
                                        setQty(0)
                                    }}
                                            className={`uppercase p-2 rounded-lg ${size.size == selectedSize?.size ? "bg-primary" : "bg-slate-200"}`}>
                                        {size.size}
                                    </button>
                                    {!selectedVariant &&
                                        <p className="text-red-500 text-xl flex text-center">Select a color</p>}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-2">
                        <h2 className="text-4xl text-yellow-400 font-medium">Quantity</h2>
                        <div className="flex gap-6 mt-2 flex-row justify-center items-center md:justify-start">
                            <button disabled={selectedSize.stock == 0} onClick={() => setQuantity("dec")}
                                    className="bg-slate-200 p-2 rounded-full">
                                <IoRemove size={20}/>
                            </button>
                            <p className="text-3xl">{qty}</p>
                            <button disabled={selectedSize.stock == 0} onClick={() => setQuantity("in")}
                                    className="bg-slate-200 p-2 rounded-full">
                                <IoAdd size={20}/>
                            </button>
                        </div>
                    </div>
                    <div onClick={addToCart} className="mt-2 w-full flex justify-start">
                        <button disabled={qty == 0}
                                className={`bg-primary text-white p-2 h-[2.6rem] rounded-2xl font-semibold w-full ${qty == 0 && "opacity-60"}`}>Add
                            to Cart
                        </button>
                    </div>
                </div>
            </article>
            {outOfStocks && (<div
                className="bg-white absolute top-0 left-0 w-full h-full bg-opacity-60 flex justify-center items-center">
                <h2 className={`text-white p-2 rounded-lg text-lg lg:text-xl tracking-wide ${outOfStocksLabel === "Coming Soon" ? "bg-yellow-500" : "bg-red-500"}`}>
                    <strong>{outOfStocksLabel}</strong></h2>
            </div>)}
        </section>
    );
};

export default ProductHero;