import React from 'react';
import {IoMail} from "react-icons/io5";
import {ContactUs} from "@/constants";

const EmailMapSection = () => {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            {/* Email Section */}
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-display font-semibold text-gray-700">Reach Us At</h2>
                <div className="flex items-start flex-col gap-2 text-gray-600">
                    <div className="flex flex-row gap-1">
                        <IoMail size={24}/>
                        <a href={`mailto:${ContactUs.supportEmail}`} className="text-blue-500 hover:underline">
                            {ContactUs.supportEmail}
                        </a>
                    </div>
                    <div className="flex flex-row gap-1">
                        <IoMail size={24}/>
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
                    width="100%" height="100%" style={{border: 0}}
                    referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
    );
};

export default EmailMapSection;