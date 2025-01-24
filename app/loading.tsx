import React from 'react';
import SkeletonItemCard from "@/components/SkeletonItemCard";
import {faqs, genderList, whyUs} from "@/constants";
import Link from "next/link";
import {BiCart} from "react-icons/bi";
import Image from "next/image";
import FaqCard from "@/app/components/FAQCard";

const SkeletonLoading = () => {
    return (
        <main className="w-full h-full">
            <section className="w-full mt-16 lg:mt-[7rem] flex flex-col gap-5">
                <div className="w-full">
                    <div
                        className="animate-pulse w-full md:h-[20rem] lg:h-[60vh] h-[50vh] bg-gray-200 rounded-lg"></div>
                    <div>
                        <div className="md:mt5 mt-3 px-3 lg:px-8">
                            <div className={"flex flex-col gap-5 mt-5"}>
                                <h3 className="text-gray-800 md:text-4xl font-bold text-2xl text-left mt-5">
                                    Explore our collection
                                </h3>
                                <ul className="flex mt-5 flex-wrap md:gap-24 gap-10 lg:mt-10 flex-row justify-evenly lg:gap-36">
                                    {
                                        genderList.map((gen, index) => (
                                            <li key={index}>
                                                <div
                                                    className="animate-pulse w-[10rem] h-[14rem] md:w-[18rem] md:h-[24rem] bg-gray-200 rounded-md"></div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="flex justify-center mt-5 lg:mt-10">
                            <Link href="/collections/products"
                                  className="flex items-center px-6 py-3 bg-primary-100 text-white rounded-lg hover:bg-primary-200
                        transition-all text-lg">
                                <BiCart size={24} className="mr-2"/>
                                Shop All
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mt-10">
                <div className="lg:px-24 px-4 w-full">
                    <div>
                        <h2 className="md:text-4xl text-2xl"><strong>New Arrivals</strong></h2>
                        <h3 className="md:text-xl text-lg text-primary mt-2">Check out our latest products</h3>
                    </div>
                    <div className="mt-10">
                        <ul className="flex flex-row justify-center items-center md:justify-start gap-5 mb-10 md:gap-10 flex-wrap mt-5 w-full">
                            {
                                Array.from({length: 7}).map((_, index) => (
                                    <li key={index}>
                                        <SkeletonItemCard/>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </section>

            <section className="w-full my-10">
                <div className="lg:px-24 px-4 py-8">
                    <div>
                        <h2 className="md:text-4xl text-2xl font-bold text-gray-800">Popular Products</h2>
                        <h3 className="md:text-xl text-lg text-primary-100 mt-2">
                            Check out our best-selling products
                        </h3>
                    </div>
                    <div className="mt-8 w-full flex justify-center items-center">
                        <ul className="flex flex-row justify-center items-center md:justify-start gap-5 mb-10 md:gap-10 flex-wrap mt-5 w-full">
                            {
                                Array.from({length: 7}).map((_, index) => (
                                    <li key={index}>
                                        <SkeletonItemCard/>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </section>

            <section className="w-full pb-10 pt-4 bg-slate-100" aria-labelledby="brands-section">
                <h2 id="brands-section"
                    className="text-center text-2xl md:text-3xl lg:text-4xl font-bold md:mt-8 mt-4 mb-4">Browse the
                    Brands!</h2>
                <div className="lg:p-8 md:p-4 p-2 md:mt-5 mt-2">
                    <ul className="flex w-full flex-wrap md:gap-10 gap-5 flex-row justify-center items-center"
                        role="list">
                        {
                            Array.from({length: 8}).map((_, index) => (
                                <li key={index}>
                                    <div
                                        className="animate-pulse w-[10rem] h-[10rem] md:w-[12rem] md:h-[12rem] bg-gray-200 rounded-full"></div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </section>
            <section className="w-full">
                <div className="lg:px-24 px-4 mt-20">
                    <header>
                        <h2 className="font-bold text-2xl md:text-4xl"><strong>Why Us?</strong></h2>
                        <h3 className="md:text-xl text-lg text-primary mt-2">We are the best in the business</h3>
                    </header>
                    <div className="flex w-full mt-5 flex-wrap gap-10 lg:gap-0 justify-evenly items-center">
                        {whyUs.map((item, index) => (
                            <div key={index} className="flex w-[22rem] flex-col justify-center items-center">
                                <figure className="flex flex-col items-center">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={100}

                                        height={100}
                                        className="w-[7rem] h-[7rem] object-cover"
                                        loading="lazy" // Lazy load images
                                    />
                                    <figcaption className="mt-2 text-center">{item.title}</figcaption>
                                </figure>
                                <p className="text-center md:text-lg text-sm font-light text-slate-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="w-full mt-10 lg:px-24 px-2" aria-labelledby="faq-section">
                <h2 id="faq-section" className="md:text-4xl text-2xl font-bold px-8">
                    <strong>FAQ</strong>
                </h2>
                <h3 className="text-lg md:text-xl text-primary mt-2 px-8">
                    Frequently Asked Questions
                </h3>
                <div className="p-8">
                    <ul className="flex flex-row flex-wrap justify-center gap-10 mt-10 w-full" role="list">
                        {faqs.map((faq, index) => (
                            <li key={index} role="listitem">
                                <FaqCard index={index} faq={faq}/>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-5">
                        <Link href={"#footer"} className="md:text-lg text-xs tracking-wide"
                              aria-label="Read our terms and conditions">
                            *Terms and conditions apply.
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default SkeletonLoading;
