import React from 'react';
import {Item} from "@/interfaces";
import SearchResultCard from "@/components/SearchResultCard";
import {motion} from "framer-motion";

const SearchDialog = ({results, onClick, containerStyle}: {
    results: Item[],
    onClick: () => void,
    containerStyle?: string
}) => {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className={`max-w-md min-w-[18rem] max-h-[25rem] bg-white text-black  shadow-custom rounded-b p-3 overflow-y-auto hide-scrollbar ${containerStyle ? containerStyle : "z-30 absolute"}`}>
            {results.map((result, index) => (
                <ul key={index} className="flex flex-col gap-3">
                    <li>
                        <SearchResultCard item={result} onClick={onClick}/>
                    </li>
                </ul>
            ))}
        </motion.div>
    );
};

export default SearchDialog;