"use client"
import React, {useState} from 'react';
import axios from "axios";
import {getIdToken} from "@/firebase/firebaseClient";

const MessageForm = () => {
    const [isLoading, setIsLoading] = useState(false)

    const onMessageSubmit = async (evt) => {
        setIsLoading(true);
        evt.preventDefault();
        const formData = new FormData(evt.target);
        const name = formData.get("name");
        const email = formData.get("email");
        const message = formData.get("message");
        const subject = formData.get("subject");

        const msg = {
            name: name,
            email: email,
            message: message,
            subject: subject
        }

        try {
            const token = await getIdToken();
            await axios({
                url: "/api/email",
                method: "POST",
                data: JSON.stringify(msg),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            evt.target.reset();
        } catch (e) {
            console.error("Error sending message:", e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-custom mt-10">
            <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Send Us a Message</h2>
            <form onSubmit={(evt) => onMessageSubmit(evt)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Your Name</label>
                    <input
                        type="text"
                        required
                        name={"name"}
                        placeholder="Enter your name"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Your Email</label>
                    <input
                        type="email"
                        name={"email"}
                        required
                        placeholder="Enter your email"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Subject</label>
                    <input
                        type="subject"
                        name={"subject"}
                        required
                        placeholder="Subject"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Your Message</label>
                    <textarea
                        required
                        name={"message"}
                        placeholder="Write your message"
                        rows={4}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                    ></textarea>
                </div>
                <button
                    disabled={isLoading}
                    type="submit"
                    className="bg-primary-100 disabled:bg-opacity-60 disabled:cursor-not-allowed text-white hover:bg-primary-300  py-2 px-4 rounded-lg transition-all">
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default MessageForm;