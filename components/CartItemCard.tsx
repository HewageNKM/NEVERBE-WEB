import React from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { removeFromCart } from "@/redux/cartSlice/cartSlice";
import { CartItem } from "@/interfaces";

const CartItemCard = ({ item }: { item: CartItem }) => {
  const dispatch: AppDispatch = useDispatch();

  return (
    <div className="flex items-center gap-4 p-3 border border-gray-200  rounded-xl bg-gray-50 relative hover:shadow-md transition-all">
      <div className="shrink-0">
        <Image
          src={item.thumbnail}
          alt={item.variantName}
          width={80}
          height={80}
          className="rounded-lg object-cover"
        />
      </div>

      <div className="flex flex-col grow capitalize">
        <h3 className="font-semibold font-display text-lg line-clamp-1">{item.name}</h3>
        <p className="text-sm text-gray-500">
          {item.variantName} | Size: {item.size}
        </p>
        <p className="text-md font-medium mt-1">
          Rs. {(item.price * item.quantity).toFixed(2)}
        </p>
        <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
      </div>

      <button
        onClick={() => dispatch(removeFromCart(item))}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
        aria-label="Remove item"
      >
        <IoClose size={22} />
      </button>
    </div>
  );
};

export default CartItemCard;
