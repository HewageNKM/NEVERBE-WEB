import React from "react";
import Link from "next/link";
import { privacyPolicy } from "@/constants";

const PrivacyPolicyContent = () => {
  const renderSection = (key: string, value: any) => {
    if (key === "intro") return null;

    return (
      <section key={key} className="space-y-4">
        <h2 className="text-2xl font-semibold mb-2 capitalize text-gray-900">
          {value.title || key.replace(/([A-Z])/g, " $1")}
        </h2>

        {typeof value === "string" && (
          <p className="leading-relaxed text-gray-700">{value}</p>
        )}

        {value.description && (
          <p className="leading-relaxed text-gray-700">{value.description}</p>
        )}

        {Array.isArray(value) &&
          value.map((item: string, idx: number) => (
            <li key={idx} className="list-disc list-inside leading-relaxed text-gray-700">
              {item}
            </li>
          ))}

        {/* Special handling for nested objects like informationCollection */}
        {typeof value === "object" &&
          !Array.isArray(value) &&
          Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="mt-2">
              {typeof subValue === "string" && (
                <p className="leading-relaxed text-gray-700">{subValue}</p>
              )}
              {Array.isArray(subValue) &&
                subValue.map((item: string, idx: number) => (
                  <li
                    key={idx}
                    className="list-disc list-inside leading-relaxed text-gray-700"
                  >
                    {item}
                  </li>
                ))}
            </div>
          ))}
      </section>
    );
  };

  return (
    <article className="space-y-8 text-gray-800">
      <p className="mb-6 leading-relaxed">
        {privacyPolicy.sections.intro}{" "}
        <a
          href={privacyPolicy.website}
          className="text-blue-600 underline hover:text-blue-800 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {privacyPolicy.website}
        </a>
      </p>

      {Object.entries(privacyPolicy.sections).map(([key, value]) =>
        renderSection(key, value)
      )}
    </article>
  );
};

export default PrivacyPolicyContent;
