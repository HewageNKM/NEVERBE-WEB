import React from 'react';
import Link from "next/link";

const AboutUs = () => {
    return (
        <section className="lg:pt-32 pt-12 md:pt-16 w-full">
            {/* Hero Section */}
            <div className="relative w-full bg-gradient-to-r from-primary-100 to-indigo-600 text-white py-20 px-6 md:px-20">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="md:text-5xl text-4xl font-bold mb-4">About NEVERBE</h1>
                    <p className="text-lg md:text-xl">
                        Your trusted destination for premium copy shoes in Sri Lanka, redefining style and affordability.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-gray-100 py-16 px-6 md:px-20">
                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Who We Are */}
                    <section className="bg-white rounded-lg shadow-xl p-8">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Who We Are</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            At NEVERBE, we take pride in offering high-quality replicas of globally renowned shoe brands.
                            Our commitment is to bring unparalleled style and comfort to every customer while maintaining
                            affordable prices. Whether you&apos;re looking for everyday essentials or statement footwear, we&apos;ve
                            got you covered.
                        </p>
                    </section>

                    {/* Mission and Vision */}
                    <section className="bg-white rounded-lg shadow-xl p-8">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Mission & Vision</h2>
                        <div className="space-y-6">
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Our mission is simple: to provide top-notch replica shoes that blend durability, design, and value.
                                We believe that style should be accessible to all, regardless of budget.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Our vision is to lead the replica shoe market in Sri Lanka with a focus on ethical practices,
                                outstanding customer service, and unwavering quality.
                            </p>
                        </div>
                    </section>

                    {/* Why Choose Us */}
                    <section className="bg-white rounded-lg shadow-xl p-8">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Why Choose NEVERBE?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Affordable Luxury</h3>
                                <p className="text-gray-600">
                                    Experience premium designs without breaking the bank.
                                </p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Extensive Collection</h3>
                                <p className="text-gray-600">
                                    A diverse range of styles to suit every occasion.
                                </p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Reliable Shipping</h3>
                                <p className="text-gray-600">
                                    Fast, secure delivery across Sri Lanka.
                                </p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Exceptional Support</h3>
                                <p className="text-gray-600">
                                    Dedicated customer service for all your queries.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
