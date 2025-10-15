import React from "react";
import { contactInfo } from "@/constants";
import Link from "next/link";

const ContactDetailsSection = () => {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-gray-900 font-display">
        Reach Us At
      </h2>
      <ul className="flex flex-col gap-4">
        {contactInfo.map((info, idx) => (
          <li key={idx}>
            <Link
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors"
            >
              <info.icon size={24} className="text-gray-500" />
              <span className="text-lg">{info.content}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-gray-600 text-sm leading-relaxed max-w-md">
        You can contact us via email for any inquiries, support requests, or
        partnership opportunities. We typically respond within 24 hours.
      </p>
    </section>
  );
};

export default ContactDetailsSection;
