import React from 'react';
import MessageForm from './components/MessageForm';
import EmailMapSection from "@/app/contact/components/EmailMapSection";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Contact Us - NEVERBE",
    description: "Contact NEVERBE for any inquiries, support requests, or feedback. Reach us via email or visit our store location.",
    keywords: "NEVERBE, contact, support, inquiries, feedback",
    twitter: {
        card: "summary",
        site: "@neverbe",
        creator: "@neverbe",
        title: "Contact Us - NEVERBE",
        description: "Contact NEVERBE for any inquiries, support requests, or feedback.",
    },
    openGraph: {
        title: "Contact Us - NEVERBE",
        description: "Contact NEVERBE for any inquiries, support requests, or feedback.",
        url: "https://neverbe.lk/contact",
        type: "website",
        images: [
            {
                url: "https://neverbe.lk/api/og",
                width: 260,
                height: 260,
                alt: "NEVERBE Logo",
            },
        ],
    },
}
const ContactPage = () => {

    return (
        <div className="flex lg:mt-28 flex-col items-center bg-white py-10">
            <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-custom">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Contact Us</h1>
                <EmailMapSection />
                <MessageForm />
            </div>
        </div>
    );
};

export default ContactPage;
