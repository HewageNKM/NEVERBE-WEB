"use client";
import React from 'react';
import { IoMail } from "react-icons/io5";
import {ContactUs} from "@/constants";

const ContactPage = () => {
    return (
        <div className="flex lg:mt-28 flex-col items-center bg-white py-10">
            {/* Contact Info Section */}
            <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-custom">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Contact Us</h1>

                <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                    {/* Email Section */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-semibold text-gray-700">Reach Us At</h2>
                        <div className="flex items-start flex-col gap-2 text-gray-600">
                            <div className="flex flex-row gap-1">
                                <IoMail size={24} />
                                <a href={`mailto:${ContactUs.supportEmail}`} className="text-blue-500 hover:underline">
                                    {ContactUs.supportEmail}
                                </a>
                            </div>
                            <div className="flex flex-row gap-1">
                                <IoMail size={24} />
                                <a href={`mailto:${ContactUs.infoEmail}`} className="text-blue-500 hover:underline">
                                    {ContactUs.infoEmail}
                                </a>
                            </div>
                        </div>
                        <p className="text-gray-600">
                            You can contact us via email for any inquiries or support requests.
                        </p>
                    </div>

                    {/* Google Maps Embed */}
                    <div className="w-full h-64 lg:w-1/2">
                        <iframe
                            src={ContactUs.embeddedMap}
                            loading="lazy"
                            width="100%" height="100%" style={{ border: 0 }}
                            referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </div>

            {/* Send Message Section */}
            <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-custom mt-10">
                <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Send Us a Message</h2>
                <form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-medium">Your Name</label>
                        <input
                            type="text"
                            required
                            placeholder="Enter your name"
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-medium">Your Email</label>
                        <input
                            type="email"
                            required
                            placeholder="Enter your email"
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-medium">Your Message</label>
                        <textarea
                            required
                            placeholder="Write your message"
                            rows={4}
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
