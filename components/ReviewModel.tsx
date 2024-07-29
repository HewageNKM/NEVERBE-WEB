import React from 'react';
import Backdrop from "@/components/Backdrop";
import {Button, Rating} from "@mui/material";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/store";
import {motion} from "framer-motion";
import {closeReviewDialog} from "@/lib/features/shoeReviewSlice/shoeReviewSlice";

const ReviewModel = () => {
    const dispatch: AppDispatch = useDispatch();
    return (
        <Backdrop containerStyles="w-[100%] z-50 fixed top-0 left-0 flex justify-center items-center h-[100%] bg-opacity-70 bg-black">
            <motion.div initial={
                {y: '-100vh', opacity: 0}}
                        exit={{
                            y: '100vh',
                            opacity: 0,
                        }} animate={{
                y: 0,
                opacity: 1,
                transition: {
                    type: "spring",
                    damping: 20,
                    stiffness: 200,
                }
            }} className="w-96 h-96 bg-white flex relative flex-col gap-2 justify-center items-center rounded-2xl p-5">
                <h1 className="text-3xl font-bold">Write a Review</h1>
                <Rating precision={0.1}/>
                <textarea placeholder="Write Your Feedback" className="w-full h-40 mt-5 border-2 border-gray-300 p-2 rounded-md"/>
                <div className="flex w-full flex-row justify-between items-center mt-5">
                    <Button variant={"contained"} className="bg-primary hover:bg-primary-100 w-full font-medium text-lg">
                        Submit
                    </Button>
                </div>
                <Button onClick={()=>{dispatch(closeReviewDialog())}}  className="text-black rounded-full w-fit h-fit font-bold text-lg absolute right-1 top-2 hover:bg-white">
                    X
                </Button>
            </motion.div>
        </Backdrop>
    );
};

export default ReviewModel;