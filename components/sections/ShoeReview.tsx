import React, {useEffect, useState} from 'react';
import {getReviewsById} from "@/firebase/Firebase";
import ReviewCard from "@/components/ReviewCard";
import {Rating} from "@mui/material";
import EmptyState from "@/components/EmptyState";

const ShoeReview = ({shoe}: { shoe: object }) => {
    const [rating, setRating] = useState(0)
    const [reviews, setReviews] = useState([]);
    const fetchReviews = async () => {
        const rv = await getReviewsById(shoe?.shoeId, 5);
        setReviews(rv)
    }
    useEffect(() => {
        fetchReviews()
        setRating(shoe.rating)
    }, [shoe]);

    return (
        <div className="w-full mt-20 h-full">
            <div>
                <h1 className="text-5xl font-bold">Review<span
                    className="text-sm hover:border-b cursor-pointer border-b-black font-medium">{shoe?.reviews}</span>
                </h1>
            </div>
            <div className="mt-2 flex flex-col justify-center items-center">
                {reviews?.length  > 0 ? (<div className="flex flex-col w-full justify-center items-center">
                            <h2 className="text-3xl">{rating}</h2>
                            <Rating value={rating} readOnly precision={0.1}/>
                        </div>
                    ) :
                    (<div className="mt-5">
                        <EmptyState title="No Reviews Found!" subTitle="Be the first one"/>
                    </div>)}
                <div className="flex mt-10 flex-col w-full justify-center items-center">
                    {
                        reviews?.map((item, index) => (<ReviewCard key={index} review={item}/>))
                    }
                </div>
                <div className="flex flex-row gap-3 flex-wrap justify-center items-center">
                    {reviews?.length > 4 && (
                        <button className="mt-5 font-bold border-b text-lg border-b-black">More Review</button>)}
                    {true && (
                        <button className="mt-5 font-bold border-b text-lg border-b-black">Write a Review</button>)}
                </div>
            </div>
        </div>
    );
};

export default ShoeReview;