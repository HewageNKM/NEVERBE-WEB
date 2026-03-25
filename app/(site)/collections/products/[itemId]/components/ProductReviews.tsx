"use client";
import React, { useEffect, useState } from "react";
import { Flex, Button, Rate, Typography, Empty, Avatar, Space, Skeleton } from "antd";
import axiosInstance from "@/actions/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { auth } from "@/firebase/firebaseClient";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { FcGoogle } from "react-icons/fc";
import ReviewForm from "@/components/ReviewForm";
import { Product } from "@/interfaces/Product";
import { IoStar, IoCreateOutline } from "react-icons/io5";

const { Title, Text } = Typography;

interface Review {
  reviewId: string;
  userName: string;
  rating: number;
  review: string;
  source?: "GOOGLE" | "WEB";
  createdAt: string;
}

interface ProductReviewsProps {
  product: Product;
}

const ProductReviews = ({ product }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.authSlice);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/web/reviews?itemId=${product.id}&limit=20`);
      setReviews(res.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  const handleWriteReview = () => {
    if (!user) {
      toast.error("Please login to write a review");
      window.location.href = "/account/login";
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-16 py-20 border-t border-default animate-fade">
      <Flex justify="space-between" align="center" className="mb-12">
        <div>
          <Title level={2} className="uppercase tracking-tighter font-black m-0">
            Customer Reviews
          </Title>
          <Flex gap={8} align="center" className="mt-2">
            <Rate disabled allowHalf defaultValue={4.5} className="text-accent text-sm" />
            <Text className="text-muted text-xs font-bold uppercase tracking-widest">
              {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
            </Text>
          </Flex>
        </div>
        <Button
          type="primary"
          icon={<IoCreateOutline size={18} />}
          onClick={handleWriteReview}
          className="bg-dark border-none rounded-full px-8 h-12 font-black uppercase text-[11px] tracking-widest hover:bg-accent! hover:text-dark! flex items-center justify-center gap-2"
        >
          Write a Review
        </Button>
      </Flex>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 bg-surface-1 rounded-3xl border border-default">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.reviewId}
              className="p-8 bg-surface-1 rounded-3xl border border-default hover:border-accent/30 transition-all hover:shadow-xl hover:shadow-accent/5 group"
            >
              <Flex gap={12} align="center" className="mb-6">
                <Avatar className="bg-accent text-dark font-black uppercase text-xs">
                  {review.userName?.[0] || "U"}
                </Avatar>
                <div>
                  <Text className="block text-sm font-black text-primary-dark m-0 leading-none mb-1 flex items-center gap-2">
                    {review.userName}
                    {review.source === "GOOGLE" && (
                      <FcGoogle size={14} className="mt-0.5" />
                    )}
                  </Text>
                  <Text className="text-[10px] text-muted uppercase tracking-widest font-black leading-none">
                    {review.source === "GOOGLE" ? "Verified Google Review" : formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  </Text>
                </div>
              </Flex>
              <Rate disabled defaultValue={review.rating} className="text-accent text-xs mb-4 block" />
              <Text className="text-primary-dark/80 text-sm leading-relaxed font-medium italic">
                "{review.review}"
              </Text>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          description={
            <div className="text-center py-10">
              <Text className="block text-muted text-sm font-medium mb-4">
                Be the first to review this product!
              </Text>
              <Button
                type="text"
                onClick={handleWriteReview}
                className="text-accent font-black uppercase text-[10px] tracking-widest hover:bg-transparent"
              >
                Submit your experience
              </Button>
            </div>
          }
          className="py-20 bg-surface-1 rounded-3xl border border-dashed border-default"
        />
      )}

      <ReviewForm
        open={isModalOpen}
        productId={product.id}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchReviews();
        }}
      />
    </div>
  );
};

export default ProductReviews;
