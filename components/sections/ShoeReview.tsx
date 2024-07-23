import React, {useEffect} from 'react';
import ReviewCard from "@/components/ReviewCard";
import {Rating} from "@mui/material";
import EmptyState from "@/components/EmptyState";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {getReviews} from "@/lib/features/shoeReviewSlice/shoeReviewSlice";
import {Modal, ModalBody, ModalFooter, ModalProvider, ModalTrigger, useModal} from "@/components/AnimatedModel";

const ShoeReview = ({shoe,containerStyles}:{shoe:object,containerStyles:string}) => {
    const dispatch:AppDispatch = useDispatch();
    const reviews = useSelector((state:RootState) => state.shoeReviewSlice.reviews);
    useEffect(() => {
        dispatch(getReviews(shoe?.shoeId))
    }, [dispatch,shoe?.shoeId]);
    return (

        <div className={`w-full mt-20 h-full ${containerStyles}`}>
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
                        <Modal>
                            <ModalTrigger className="text-lg m-0 hover:text-gray-500 font-medium h-[2.3rem] border-b-black hover:border-b-gray-500 border-b-[1.5px] px-0 rounded-none">
                                Write a Review
                            </ModalTrigger>
                            <ModalBody className="p-2 md:w-[50vw]">
                                <div className="flex flex-col gap-4 justify-center items-center">
                                    <h1 className="text-2xl font-bold">Write a Review</h1>
                                    <Rating precision={0.1}/>
                                    <textarea placeholder="Write a review" className="w-full bg-gray-100 rounded-xl p-2 h-40 p-2"/>
                                    <ModalTrigger  className="bg-black text-white p-2 rounded-md">
                                        Submit
                                    </ModalTrigger>
                                </div>
                            </ModalBody>
                        </Modal>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShoeReview;