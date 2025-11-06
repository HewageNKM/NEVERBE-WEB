"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ReCaptchaProviderWrapper = ({ children }: Props) => {
  return (
    <main className="z-50">
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        useRecaptchaNet
        scriptProps={{ async: true, defer: true, appendTo: "body" }}
      >
        {children}
      </GoogleReCaptchaProvider>
    </main>
  );
};

export default ReCaptchaProviderWrapper;
