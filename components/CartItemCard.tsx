import React from 'react';
import Image from "next/image";
import {removeFromCart} from "@/redux/cartSlice/cartSlice";
import {CartItem} from "@/interfaces";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/redux/store";
import {IoClose} from "react-icons/io5";

const CartItemCard = ({item}:{item:CartItem}) => {
    const dispatch:AppDispatch = useDispatch();
    return (
        <div className="flex items-center p-4 border rounded-lg relative shadow-sm bg-gray-100">
            <Image
                src={item.thumbnail}
                alt={item.variantName}
                width={80}
                height={80}
            />
            <div className="flex-grow ml-4 capitalize">
                <h3 className="text-lg">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.variantName} | Size: {item.size}</p>
                <p className="text-md">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">QTY: {item.quantity}</span>
                </div>
            </div>
            <button
                onClick={() => dispatch(removeFromCart(item))}
                className="text-red-500 absolute top-2 right-2 hover:underline"
            >
                <IoClose size={25}/>
            </button>
        </div>
    );
};

export default CartItemCard;