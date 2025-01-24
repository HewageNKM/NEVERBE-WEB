import React, { useState } from 'react';
import { Review } from "@/interfaces";
import Image from "next/image";
import ReactStars from 'react-stars';
import { Avatar } from "@/assets/images";
import { IoTrashBin } from "react-icons/io5";

const ReviewCard = ({ review, userReviewId, onDelete }: {
    review: Review,
    userReviewId: string,
    onDelete: (reviewId: string) => void
}) => {
    const [showFullReview, setShowFullReview] = useState(false);

    const toggleReview = () => {
        setShowFullReview(!showFullReview);
    };

    const isLongReview = review.review.split(' ').length > 20;

    return (
        <div
            className="flex flex-col relative h-auto w-[10rem] md:w-[13rem] bg-gray-100 shadow-custom rounded-lg p-4 transition-transform transform hover:scale-105">
            {/* User Info */}
            <div className="flex items-center flex-col">
                <Image
                    width={48}
                    height={48}
                    src={Avatar}
                    alt="user"
                    className="w-16 h-16 rounded-full border border-gray-300 shadow-sm"
                />
                <div className="mt-3 text-center">
                    <h3 className="md:text-lg text-sm font-semibold text-gray-800 capitalize">{review.userName}</h3>
                    <p className="md:text-sm text-xs text-gray-500">{review.createdAt}</p>
                </div>
            </div>
            {/* Rating */}
            <div className="mt-1 flex justify-center items-center">
                <ReactStars
                    edit={false}
                    value={review.rating}
                    count={5}
                    size={25}
                    color2={'#ffd700'}
                />
                <span>({review.rating})</span>
            </div>
            {/* Review Content */}
            <div className="mt-4">
                <p className="text-center text-sm text-gray-700 font-medium leading-relaxed">
                    {showFullReview || !isLongReview ? review.review : review.review.split(' ').slice(0, 10).join(' ') + '...'}
                </p>
                {isLongReview && (
                    <div className="flex justify-center items-center">
                        <button
                            onClick={toggleReview}
                            className="mt-2 text-blue-500 hover:underline text-xs md:text-sm"
                        >
                            {showFullReview ? 'Show Less' : 'Show More'}
                        </button>
                    </div>
                )}
            </div>
            {
                userReviewId === review.reviewId && (
                    <div className="absolute top-2 right-2">
                        <button className="text-red-500" onClick={() => onDelete(review.reviewId)}>
                        <IoTrashBin size={20} />
                        </button>
                    </div>
                )
            }
        </div>
    );
};

export default ReviewCard;
