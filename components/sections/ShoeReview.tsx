import React, {useEffect, useState} from 'react';
import EmptyState from "@/components/EmptyState";
import {rv} from '@/constants/Reviews';
import {getReviewsById} from "@/firebase/Firebase";
import ReviewCard from "@/components/ReviewCard";
import {useGlobalContext} from "@/context/GlobalProvider";
import FormField from "@/components/FormField";

const ShoeReview = ({shoeId}: { shoeId: string }) => {
    const {isLoggedIn} = useGlobalContext();
    const [reviews, setReviews] = useState([]);
    const fetchReviews = async () => {
        const rv = await getReviewsById(shoeId);
        setReviews(rv)
    }
    useEffect(() => {
        fetchReviews()
    }, []);
    return (
        <div className="w-full mt-20">
            <div>
                <h1 className="text-5xl font-bold">Review</h1>
            </div>
            {reviews?.length > 0 ? (<div className="mt-2">
                <ReviewCard review={[]}/>
            </div>) : (
                <div className="mt-2">
                    <EmptyState title="No Reviews Found!" subTitle="Be the first one"/>
                </div>
            )}
            {isLoggedIn && (
                <div className="mt-5 flex flex-1 justify-center items-center">
                    <form className="flex gap-2 flex-col">
                        <legend className="text-2xl font-bold">Write a Review</legend>
                        <FormField placeholder="Name" containerStyles="" otherStyles="p-2 md:w-[30vw]"/>
                        <textarea placeholder="Write Your Review"
                                  className="mt-1 md:w-[30vw] h-[15vh] bg-gray-100 p-2 rounded-xl"/>
                        <button className="mt-2 bg-black text-white p-2 rounded-md">Add</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ShoeReview;