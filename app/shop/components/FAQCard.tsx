"use client"
import React, {useState} from 'react';
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/md";

const FaqCard = ({faq, index}: { faq: { question: string, answer: string }, index: number }) => {
    const [showAnswer, setShowAnswer] = useState(false);
    return (
        <div className={`rounded-lg transition-all duration-300 border p-4 w-fit ${showAnswer ? "lg:h-[6rem] h-[7.5rem]" : "h-[5rem] lg:h-[4.5rem]"}`}>
            <button onClick={() => setShowAnswer(!showAnswer)}
                    className="flex flex-row text-lg md:text-3xl text-primary w-fit text-center font-semibold">
                <p>{index + 1}. {faq.question}</p>
                <figure>{showAnswer ? (<MdKeyboardArrowUp size={40}/>) : (<MdKeyboardArrowDown size={40}/>)}</figure>
            </button>
            {showAnswer && (<p className="text-xs md:text-lg font-medium">{faq.answer}</p>)}
        </div>
    );
};

export default FaqCard;