import React from 'react';
import {BsEmojiFrown} from "react-icons/bs";

const EmptyState = ({message}:{message:string}) => {
    return (
        <div className="flex w-full justify-center gap-1">
            <div className="flex flex-col gap-1 text-red-500 justify-center items-center">
                <div><BsEmojiFrown size={50}/></div>
                <h1 className="md:text-2xl text-lg tracking-wider font-semibold  text-center w-full">{message}</h1>
            </div>
        </div>
    );
};

export default EmptyState;