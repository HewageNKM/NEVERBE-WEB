import ReCaptchaProviderWrapper from "@/app/(site)/components/ReCaptchaProvider";
import React from "react";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReCaptchaProviderWrapper>{children}</ReCaptchaProviderWrapper>;
}
