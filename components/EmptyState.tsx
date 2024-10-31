import React from 'react';
import { BsEmojiFrown } from "react-icons/bs";

const EmptyState = ({ message }: { message: string }) => {
    return (
        <div className="flex w-full justify-center items-center py-8" role="alert">
            <div className="flex flex-col items-center text-gray-700 dark:text-gray-300 gap-4">
                <BsEmojiFrown size={48} className="text-gray-400 dark:text-gray-500 animate-bounce" aria-hidden="true" />
                <h2
                    className="md:text-2xl text-xl font-semibold text-center px-4 max-w-lg tracking-wide leading-snug"
                    id="empty-state-message"
                >
                    {message}
                </h2>
            </div>
        </div>
    );
};

export default EmptyState;
