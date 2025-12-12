"use client";
import React from "react";
import { contactInfo } from "@/constants";
import Link from "next/link";

const ContactDetailsSection = () => {
  return (
    <section className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-black uppercase tracking-tighter mb-2">
          Get in Touch
        </h2>
        <div className="h-1 w-12 bg-black"></div>
      </div>

      <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-sm">
        For inquiries regarding online orders, shipping, or returns, please
        contact our support team. We typically respond within 24 hours.
      </p>

      <ul className="flex flex-col gap-6">
        {contactInfo.map((info, idx) => (
          <li key={idx}>
            <Link
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-start gap-1"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
                {info.title || "Contact"}{" "}
                {/* Assuming your constant might have a title, if not, hardcode or infer */}
              </span>
              <div className="flex items-center gap-3">
                <info.icon size={20} className="text-black" />
                <span className="text-lg font-bold text-black border-b border-transparent group-hover:border-black transition-all">
                  {info.content}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ContactDetailsSection;
