import React from "react";
import Link from "next/link";
import { privacyPolicy } from "@/constants";

const PrivacyPolicyContent = () => {
  const renderSection = (key: string, value: any, index: number) => {
    if (key === "intro") return null;

    return (
      <section
        key={key}
        className="py-8 border-t border-default first:border-none"
      >
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
          {/* Section Title - Left Sticky-ish feel on Desktop */}
          <div className="md:w-1/3 shrink-0">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1 block">
              {String(index).padStart(2, "0")}
            </span>
            <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-accent">
              {value.title || key.replace(/([A-Z])/g, " $1")}
            </h2>
          </div>

          {/* Content - Right */}
          <div className="md:w-2/3 space-y-4 text-sm md:text-base text-body font-medium leading-relaxed">
            {typeof value === "string" && <p>{value}</p>}

            {value.description && <p>{value.description}</p>}

            {Array.isArray(value) && (
              <ul className="space-y-2 mt-2">
                {value.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Special handling for nested objects */}
            {typeof value === "object" &&
              !Array.isArray(value) &&
              Object.entries(value).map(([subKey, subValue]) => (
                <div
                  key={subKey}
                  className="mt-4 p-4 bg-surface-2 border border-default"
                >
                  {typeof subValue === "string" && (
                    <p className="mb-2">{subValue}</p>
                  )}
                  {Array.isArray(subValue) && (
                    <ul className="space-y-2">
                      {subValue.map((item: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs md:text-sm"
                        >
                          <span className="text-primary font-bold">›</span>{" "}
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <article className="w-full">
      {/* Intro Paragraph */}
      <div className="mb-16 max-w-3xl">
        <p className="text-lg md:text-xl font-medium text-body leading-relaxed">
          {privacyPolicy.sections.intro}{" "}
          <a
            href={privacyPolicy.website}
            className="text-primary underline decoration-1 underline-offset-4 decoration-accent hover:decoration-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {privacyPolicy.website}
          </a>
        </p>
      </div>

      {/* Sections */}
      <div className="flex flex-col">
        {Object.entries(privacyPolicy.sections).map(([key, value], idx) =>
          renderSection(key, value, idx),
        )}
      </div>
    </article>
  );
};

export default PrivacyPolicyContent;
