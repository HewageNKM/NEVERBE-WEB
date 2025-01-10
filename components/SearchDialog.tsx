import React from 'react';
import {Item} from "@/interfaces";
import SearchResultCard from "@/components/SearchResultCard";
import {motion} from "framer-motion";

const SearchDialog = ({results, onClick}: { results: Item[], onClick: () => void }) => {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="max-w-md lg:min-w-[20rem] md:min-w-[15rem] max-h-[25rem] absolute z-30 bg-white text-black  shadow-custom rounded-b -t p-3 overflow-y-auto hide-scrollbar">
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