import React from 'react';
import { BsEmojiFrown } from "react-icons/bs";

const EmptyState = ({ message }: { message: string }) => {
    return (
        <div className="flex w-full justify-center items-center py-12 px-6" role="alert">
            <div className="flex flex-col items-center dark:bg-gray-800 rounded-lg p-8 gap-6 max-w-md text-center">
                <div className="flex justify-center items-center w-16 h-16  dark:bg-gray-700 rounded-full">
                    <BsEmojiFrown size={36} className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
                </div>
                <h2
                    className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-200 leading-snug"
                    id="empty-state-message"
                >
                    {message}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    It seems there&apos;s nothing to show here right now. Please check back later!
                </p>
            </div>
        </div>
    );
};

export default EmptyState;
