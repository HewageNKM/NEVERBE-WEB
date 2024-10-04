"use client"
import React, {useState} from 'react';
import Link from "next/link";
import Skeleton from "@/components/Skeleton";
import Image from "next/image";
import {CartItem, Item, Size, Variant} from "@/interfaces";
import {IoAdd, IoRemove} from "react-icons/io5";
import {AppDispatch} from "@/redux/store";
import {useDispatch} from "react-redux";
import {pushToCart} from "@/redux/cartSlice/cartSlice";

const ProductHero = ({item}:{item:Item}) => {
    const [selectedImage, setSelectedImage] = useState(item.thumbnail)
    const [selectedVariant, setSelectedVariant] = useState<Variant>({variantId: "", variantName: "", images: [], sizes: []});
    const [selectedSize, setSelectedSize] = useState<Size>({size: "", stock: 0});
    const [qty, setQty] = useState(0)

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
    return (
        <div>
            <h1 className="md:text-4xl text-2xl font-bold tracking-wider mt-10">Product Portfolio</h1>
            <div className="flex flex-row ga-1 text-blue-500 items-center text-sm md:text-lg">
                <Link href={"/"}>Home</Link>
                <Link href={"/shop/products"}>/Products/</Link>
                <Link href={`/app/shop/products/${item.itemId}`}> {item.itemId}</Link>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6 md:gap-10 mt-10">
                <div className="flex flex-row items-center justify-center flex-wrap gap-5">
                    <Image src={selectedImage} alt={item.name} width={300} height={300} className={"md:w-[40vw] md:h-[65vh] w-full h-[45vh] rounded-lg"}/>
                    <div className="flex flex-row justify-center gap-5">
                        {selectedVariant.images.map((image:string, index:number) => (
                            <button onClick={() => setSelectedImage(image)} key={index}
                                    className={`${selectedImage == image && "border-primary border-4 rounded-lg"}`}>
                                <Image src={image} alt={item?.name} width={100} height={100}
                                       className="bg-cover w-[6rem] h-[6rem] rounded-lg"/>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    {item ? (
                        <p className="text-xl capitalize font-semibold text-slate-500">{item?.manufacturer}</p>) : (
                        <Skeleton containerStyles="w-[5rem] h-[2rem]"/>)}
                    {item ? (<h1 className="text-4xl font-bold text-primary capitalize">{item?.name}</h1>) : (
                        <Skeleton containerStyles="w-[10rem] h-[2rem]"/>)}
                    <div>
                        {item ? (<p className="text-3xl text-red-500">{"Rs. " + (item?.sellingPrice)}</p>) : (
                            <Skeleton containerStyles="w-[5rem] h-[2rem]"/>)}
                        {item?.discount > 0 &&
                            <p className="line-through text-lg text-gray-500">{"Rs. " + (item?.sellingPrice + (item?.sellingPrice * item?.discount / 100)).toFixed(2)}</p>}
                    </div>
                    <div className="mt-2">
                        <h2 className="text-4xl text-yellow-400 font-medium">Colors</h2>
                        <div className="flex gap-6 mt-2 flex-row flex-wrap">
                            {item ? (item?.variants?.map((variant: Variant, index) => (
                                <button onClick={() => {
                                    setSelectedVariant(variant)
                                    setSelectedImage(variant.images[0])
                                    setSelectedSize({} as Size)
                                    setQty(0)
                                }} key={index}
                                        className={`uppercase p-2 rounded-lg ${selectedVariant?.variantId === variant.variantId ? "bg-primary" : "bg-slate-200"}`}>
                                    {variant.variantName}
                                </button>
                            ))) : (<Skeleton containerStyles="w-full h-[15vh]"/>)}
                        </div>
                    </div>
                    <div className="mt-2">
                        <h2 className="text-4xl text-yellow-400 font-medium">Sizes</h2>
                        {selectedSize &&
                            <p className="text-slate-500">{(selectedSize?.stock || 0) + " Available"}</p>}
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
                            {!selectedVariant &&
                                <p className="text-red-500 text-xl flex text-center">Select a color</p>}
                        </div>
                    </div>
                    <div className="mt-2">
                        <h2 className="text-4xl text-yellow-400 font-medium">Quantity</h2>
                        <div className="flex gap-6 mt-2 flex-row justify-center items-center md:justify-start">
                            <button disabled={!selectedSize} onClick={() => setQuantity("dec")}
                                    className="bg-slate-200 p-2 rounded-full">
                                <IoRemove size={20}/>
                            </button>
                            <p className="text-3xl">{qty}</p>
                            <button disabled={!selectedSize} onClick={() => setQuantity("in")}
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
            </div>
        </div>
    );
};

export default ProductHero;