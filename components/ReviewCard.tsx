import React from 'react';
import {Rating} from "@mui/material";



const ReviewCard = ({review}: { review: object }) => {
    return (
        <div className="flex relative flex-col justify-center items-center md:w-[20rem] h-fit pb-12 p-2" >
            <div className="flex flex-col items-center justify-center">
                <Rating color="black" value={review.review.rating} readOnly={true} precision={0.1}/>
                <h3 className="text-sm text-gray-500">{review.username}</h3>
            </div>
            <p className="font-semibold text-gray-500 text-sm">{review.review.description}</p>
            <p className="font-semibold text-sm absolute left-1.5 bottom-3 mt-2">{new Date(review.createdAt.seconds * 1000).toUTCString()}</p>
        </div>
    );
};

export default ReviewCard;