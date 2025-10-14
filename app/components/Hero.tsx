import React from 'react';
import ImagesSlider from "@/app/components/ImagesSlider";
import Link from "next/link";
import { BiCart } from "react-icons/bi";
import { Slide } from "@/interfaces";
import { collectionList } from "@/constants";
import CollectionCard from "@/app/components/CollectionCard";

const Hero = async ({ slides }: { slides: Slide[] }) => {
  return (
    <section className="w-full mt-16 lg:mt-[7rem] flex flex-col gap-8">
      {/* Slider */}
      <ImagesSlider images={slides} />

      {/* Collections */}
      <div className="px-4 lg:px-8">
        <div className="flex flex-col gap-6">
          <h3 className="text-gray-800 text-2xl md:text-4xl font-bold tracking-tight">
            Explore Our Collection
          </h3>

          <ul className="flex flex-wrap justify-center md:justify-evenly gap-8 md:gap-16 lg:gap-24 mt-6">
            {collectionList.map((collection, idx) => (
              <li key={idx} className="transition-transform hover:scale-105 duration-300">
                <CollectionCard 
                  url={collection.url} 
                  gender={collection.gender} 
                  image={collection.image} 
                />
              </li>
            ))}
          </ul>

          {/* Shop All Button */}
          <div className="flex justify-center mt-8">
            <Link 
              href="/collections/products"
              className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-400 transition-all shadow-md hover:shadow-lg font-medium text-lg"
            >
              <BiCart size={24} className="mr-2" />
              Shop All
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
