import React, {useEffect, useState} from 'react';
import ReviewCard from "@/components/ReviewCard";
import {Button, Rating} from "@mui/material";
import EmptyState from "@/components/EmptyState";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {getReviews, openReviewDialog} from "@/lib/features/shoeReviewSlice/shoeReviewSlice";

const ShoeReview = ({shoe, containerStyles}: { shoe: object, containerStyles: string }) => {
    const dispatch: AppDispatch = useDispatch();
    const reviews = useSelector((state: RootState) => state.shoeReviewSlice.reviews);
    useEffect(() => {
        dispatch(getReviews(shoe?.shoeId))
    }, [dispatch, shoe?.shoeId]);

    return (

        <div className={`w-full mt-20 h-full relative ${containerStyles}`}>
            <div>
                <h1 className="text-5xl font-bold">Review<span
                    className="text-sm hover:border-b cursor-pointer border-b-black font-medium">{shoe?.reviews}</span>
                </h1>
            </div>
            <div className="mt-2 flex flex-col justify-center items-center">
                {reviews?.length > 0 ? (<div className="flex flex-col w-full justify-center items-center">
                            <h2 className="text-3xl">{shoe?.rating}</h2>
                            <Rating value={shoe?.rating} readOnly precision={0.1}/>
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
                    {reviews?.length > 5 && (
                        <button className="mt-5 font-bold border-b text-lg border-b-black">More Review</button>)}
                    {reviews?.length > 0 && (
                        <Button className="text-primary font-medium text-lg"
                                onClick={() => dispatch(openReviewDialog())}>
                            Write a Review
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShoeReview;