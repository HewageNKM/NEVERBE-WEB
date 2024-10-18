import React from 'react';
import { BsEmojiFrown } from "react-icons/bs";

const EmptyState = ({ message }: { message: string }) => {
    return (
        <div className="flex w-full justify-center gap-1" role="alert">
            <div className="flex flex-col gap-1 text-red-500 justify-center items-center">
                <BsEmojiFrown size={50} aria-hidden="true" /> {/* Icon does not need to be announced */}
                <h2 className="md:text-2xl text-lg tracking-wider font-semibold text-center w-full" id="empty-state-message">
                    {message}
                </h2>
            </div>
        </div>
    );
};

export default EmptyState;
