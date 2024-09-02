import React from 'react';
import {motion} from "framer-motion";
import {Button} from "@mui/material";
import {closeCartDialog} from "@/lib/features/headerSlice/headerSlice";
import Backdrop from "@/components/Backdrop";
import {AppDispatch, RootState} from "@/lib/store";
import {useDispatch, useSelector} from "react-redux";
import Image from "next/image";
import {removeItemFromCart} from "@/lib/features/cartSlice/cartSlice";

const CartModal = () => {
    const cart = useSelector((state: RootState) => state.cartSlice.items);
    const dispatch: AppDispatch = useDispatch();

    return (
        <Backdrop containerStyles="w-[100%] z-50 fixed top-0 left-0 flex justify-end h-[100%] bg-opacity-60 bg-black">
            <motion.div className="bg-white relative w-full lg:w-[30vw] h-full z-50 p-5 rounded"
                        initial={{opacity: 0, x: '100vw'}} animate={{opacity: 1, x: '0'}}
                        transition={{type: "spring", damping: 28, stiffness: 200}} exit={{opacity: 0, x: '100vw'}}>
                <h1 className="text-2xl font-bold">Cart</h1>
                <div className="w-full lg:w-[28vw] mt-1 overflow-auto">
                    <table className="w-full lg:min-w-[28vw]">
                        <tbody>
                        <tr className="border">
                            <th>Item</th>
                            <th>Price</th>
                            <th>Quantity</th>
                        </tr>
                        {cart.map((item, index) => (
                            <tr key={index} className="capitalize text-sm font-semibold">
                                <td className="border p-2 flex gap-1 items-center flex-row">
                                    <div>
                                        <Image src={item.item.thumbnail} alt={index.toString()} width={100} height={100}
                                               className="w-10 rounded h-10"/>
                                    </div>
                                    <div>
                                        {item.item.name + ", size " + item.size}
                                    </div>
                                </td>
                                <td className="border">රු{item.item.sellingPrice}</td>
                                <td className="border">
                                    <div className="flex flex-row justify-evenly items-center gap-1">
                                        <p className="text-lg">
                                            {item.quantity}
                                        </p>
                                        <button
                                            className="text-[.5rem] px-1 rounded-lg text-white bg-red-500 font-bold"
                                            onClick={() => dispatch(removeItemFromCart(item))}>
                                            Remove
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="fixed bottom-0 flex flex-col  items-center w-full  right-0 px-4 py-2">
                    <div className="flex flex-row justify-between w-full pr-4">
                        <h1 className="text-xl font-bold">
                            Total:
                        </h1>
                        <h1 className="text-xl font-bold">
                            රු {cart.reduce((acc, item) => acc + item.item.sellingPrice * item.quantity, 0)}
                        </h1>
                    </div>
                    <button
                        className="bg-primary text-white w-full hover:bg-primary-100 p-2 text-lg font-bold tracking-wider rounded-lg">
                        Checkout
                    </button>
                </div>
                <Button variant="text" className="text-black font-bold absolute top-0 -right-2" onClick={() => {
                    dispatch(closeCartDialog())
                }}>
                    X
                </Button>
            </motion.div>
        </Backdrop>
    );
};

export default CartModal;