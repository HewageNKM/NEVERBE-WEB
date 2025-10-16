// Correct CollectionCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CollectionProps {
  url: string;
  gender: string;
  image: string;
}

const CollectionCard: React.FC<CollectionProps> = ({ url, gender, image }) => {
  return (
    <article className="relative group md:w-[15rem] md:h-[20rem] w-[10rem] h-[15rem] lg:hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden">
      <Link href={`${url}?gender=${gender.toLowerCase()}`} passHref>
        <div className="relative w-full h-full">
          <Image
            width={100}
            height={120}
            src={image}
            alt={`${gender} category`}
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-opacity duration-300"
        >
          <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-semibold uppercase tracking-wide">
            {gender}
          </h2>
        </div>
      </Link>
    </article>
  );
};

export default CollectionCard;
