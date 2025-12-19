"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  hydrateWishlist,
  removeFromWishlist,
} from "@/redux/wishlistSlice/wishlistSlice";
import Link from "next/link";
import Image from "next/image";
import { IoHeartDislike, IoTrashOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const WishlistPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  useEffect(() => {
    dispatch(hydrateWishlist());
  }, [dispatch]);

  const handleRemove = (productId: string, variantId: string) => {
    dispatch(removeFromWishlist({ productId, variantId }));
  };

  return (
    <main className="w-full min-h-screen bg-white">
      {/* Header */}
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 py-12 md:py-20 text-left">
        <h1 className="text-[28px] md:text-[42px] font-medium tracking-tight text-[#111] leading-none mb-4">
          Your Wishlist
        </h1>
        <p className="text-[#707072] max-w-xl text-[16px] md:text-[18px] font-normal">
          {wishlistItems.length > 0
            ? `${wishlistItems.length} saved ${
                wishlistItems.length === 1 ? "item" : "items"
              }`
            : "Save your favorites to shop later."}
        </p>
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 pb-20">
        {wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-[#f5f5f5] rounded-full flex items-center justify-center mb-6">
              <IoHeartDislike className="text-[#707072]" size={40} />
            </div>
            <h2 className="text-[20px] font-medium text-[#111] mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-[#707072] text-[15px] mb-8">
              Browse our collection and save items you love.
            </p>
            <Link
              href="/collections/products"
              className="px-8 py-4 bg-[#111] text-white rounded-full font-medium text-[14px] hover:opacity-70 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
            <AnimatePresence>
              {wishlistItems.map((item) => (
                <motion.div
                  key={`${item.productId}-${item.variantId}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group"
                >
                  <Link href={`/collections/products/${item.productId}`}>
                    <div className="relative aspect-[4/5] bg-[#f5f5f5] overflow-hidden mb-4">
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                      />

                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(item.productId, item.variantId);
                        }}
                        className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                        aria-label="Remove from wishlist"
                      >
                        <IoTrashOutline size={18} className="text-[#111]" />
                      </button>
                    </div>
                  </Link>

                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <Link href={`/collections/products/${item.productId}`}>
                        <h3 className="text-[15px] font-medium text-[#111] leading-tight mb-1 group-hover:text-[#707072] transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-[14px] font-medium text-[#111]">
                        Rs. {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
};

export default WishlistPage;
