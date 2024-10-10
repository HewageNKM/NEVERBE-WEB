import React from 'react';
import {Metadata} from 'next';
import {privacyPolicy} from '@/constants';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    twitter: {
        card: 'summary',
        site: '@neverbe',
        creator: '@neverbe',
        title: 'Privacy Policy',
        description: 'NEVERBE Privacy Policy',
    }
};

const Page = () => {
    return (
        <div className="privacy-policy max-w-4xl mx-auto pt-10 p-4 sm:p-6 md:p-8 text-gray-800">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
            <article>
                <p className="mb-6 leading-relaxed">
                    {privacyPolicy.sections.intro}{' '}
                    <a
                        href={privacyPolicy.website}
                        className="text-blue-600 underline hover:text-blue-800"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {privacyPolicy.website}
                    </a>
                </p>
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Information Collection And Use</h2>
                    <div className="mb-6">
                        <h3 className="text-xl font-medium mb-2">Personal Data</h3>
                        <p className="leading-relaxed">{privacyPolicy.sections.informationCollection.personalData}</p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-medium mb-2">Usage Data</h3>
                        <p className="leading-relaxed">{privacyPolicy.sections.informationCollection.usageData}</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Tracking & Cookies Data</h2>
                    <p className="mb-4 leading-relaxed">{privacyPolicy.sections.trackingCookies.description}</p>
                    <ul className="list-disc list-inside mb-6">
                        {privacyPolicy.sections.trackingCookies.examples.map((example, index) => (
                            <li key={index} className="leading-relaxed">{example}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Use of Data</h2>
                    <ul className="list-disc list-inside mb-6">
                        {privacyPolicy.sections.useOfData.map((use, index) => (
                            <li key={index} className="leading-relaxed">{use}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Transfer Of Data</h2>
                    <p className="mb-6 leading-relaxed">{privacyPolicy.sections.transferOfData}</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Disclosure Of Data</h2>
                    <ul className="list-disc list-inside mb-6">
                        {privacyPolicy.sections.disclosureOfData.legalRequirements.map((requirement, index) => (
                            <li key={index} className="leading-relaxed">{requirement}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Security Of Data</h2>
                    <p className="mb-6 leading-relaxed">{privacyPolicy.sections.securityOfData}</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Service Providers</h2>
                    <p className="mb-6 leading-relaxed">{privacyPolicy.sections.serviceProviders}</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
                    <p className="mb-6 leading-relaxed">{privacyPolicy.sections.analytics.googleAnalytics}</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Links To Other Sites</h2>
                    <p className="mb-6 leading-relaxed">{privacyPolicy.sections.linksToOtherSites}</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Children’s Privacy</h2>
                    <p className="mb-6 leading-relaxed">{privacyPolicy.sections.childrenPrivacy}</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Changes To This Privacy Policy</h2>
                    <p className="leading-relaxed">{privacyPolicy.sections.changesToPrivacyPolicy}</p>
                </section>
            </article>
        </div>
    );
};

export default Page;
