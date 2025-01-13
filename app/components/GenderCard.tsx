import React from 'react';
import Link from 'next/link';
import Image from "next/image";

interface GenderCardProps {
    url: string;
    gender: string;
    image: string;
}

const GenderCard: React.FC<GenderCardProps> = ({url, gender, image}) => {
    return (
        <article className="relative group w-[15rem] h-[20rem] lg:hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden">
            <Link href={url} passHref>
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
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                    <h2 className="text-white text-lg md:text-xl lg:text-3xl font-semibold uppercase tracking-wide">
                        {gender}
                    </h2>
                </div>
            </Link>
        </article>
    );
};

export default GenderCard;
