"use client";
import React, { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface FaqCardProps {
  faq: { question: string; answer: string };
  index: number;
}

const FaqCard: React.FC<FaqCardProps> = ({ faq, index }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg"
    >
      <button
        onClick={() => setShowAnswer(!showAnswer)}
        aria-expanded={showAnswer}
        aria-controls={`faq-answer-${index}`}
        className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold text-gray-800 md:text-lg hover:bg-gray-50 transition-colors"
      >
        <span>{index + 1}. {faq.question}</span>
        <span className="ml-2">
          {showAnswer ? <MdKeyboardArrowUp size={28} /> : <MdKeyboardArrowDown size={28} />}
        </span>
      </button>

      <div 
        id={`faq-answer-${index}`} 
        className={`px-6 overflow-hidden transition-all duration-500 ${showAnswer ? "max-h-96 py-4" : "max-h-0"}`}
      >
        <p className="text-gray-600 text-sm md:text-base">{faq.answer}</p>
      </div>
    </div>
  );
};

export default FaqCard;
