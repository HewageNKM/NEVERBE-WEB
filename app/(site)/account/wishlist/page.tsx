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
import { Button, Typography, Row, Col, Card } from "antd";
const { Title, Text } = Typography;

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
      <div className="w-full max-w-content mx-auto px-4 md:px-12 py-12 md:py-20 text-left">
        <Title
          level={1}
          className="text-[28px]! md:text-[42px]! font-medium! tracking-tight! text-primary! leading-none! mb-4!"
        >
          Your Wishlist
        </Title>
        <Text className="text-secondary max-w-xl text-md md:text-[18px] font-normal block">
          {wishlistItems.length > 0
            ? `${wishlistItems.length} saved ${
                wishlistItems.length === 1 ? "item" : "items"
              }`
            : "Save your favorites to shop later."}
        </Text>
      </div>

      <div className="w-full max-w-content mx-auto px-4 md:px-12 pb-20">
        {wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-white border border-default rounded-full flex items-center justify-center mb-6">
              <IoHeartDislike className="text-[#2e9e5b]" size={40} />
            </div>
            <Title
              level={2}
              className="text-[20px]! font-medium! text-primary! mb-2!"
            >
              Your wishlist is empty
            </Title>
            <Text className="text-secondary text-[15px] mb-8 block">
              Browse our collection and save items you love.
            </Text>
            <Link
              href="/collections/products"
              className="px-8 py-3 bg-[#2e9e5b] hover:bg-[#26854b] text-white rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-md hover:shadow-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <Row gutter={[16, 48]}>
            <AnimatePresence>
              {wishlistItems.map((item) => (
                <Col
                  key={`${item.productId}-${item.variantId}`}
                  xs={12}
                  md={8}
                  lg={6}
                >
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group"
                  >
                    <Card
                      bordered={false}
                      className="bg-transparent"
                      bodyStyle={{ padding: 0 }}
                    >
                      <Link href={`/collections/products/${item.productId}`}>
                        <div className="relative aspect-4/5 bg-white overflow-hidden mb-4 rounded-2xl border border-default">
                          <Image
                            src={item.thumbnail}
                            alt={item.name}
                            fill
                            className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                          />

                          {/* Remove Button */}
                          <Button
                            type="text"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemove(item.productId, item.variantId);
                            }}
                            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 border-none p-0"
                            aria-label="Remove from wishlist"
                            icon={
                              <IoTrashOutline
                                size={18}
                                className="text-primary"
                              />
                            }
                          />
                        </div>
                      </Link>

                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <Link
                            href={`/collections/products/${item.productId}`}
                          >
                            <Title
                              level={3}
                              className="text-[15px]! font-medium! text-primary! leading-tight! mb-1! group-hover:text-secondary! transition-colors"
                            >
                              {item.name}
                            </Title>
                          </Link>
                          <Text className="text-[14px] font-medium text-primary block">
                            Rs. {item.price.toLocaleString()}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </AnimatePresence>
          </Row>
        )}
      </div>
    </main>
  );
};

export default WishlistPage;
