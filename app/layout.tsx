import "../style/globals.css";
import StoreProvider from "@/app/components/StoreProvider";
import { Analytics } from "@vercel/analytics/react";
import GlobalProvider from "@/app/components/GlobalProvider";
import ReCaptchaProviderWrapper from "@/app/components/ReCaptchaProvider";
import { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth font-sans">
      <body>
        <ReCaptchaProviderWrapper>
          <StoreProvider>
            <GlobalProvider>{children}</GlobalProvider>
            <Analytics />
          </StoreProvider>
        </ReCaptchaProviderWrapper>
      </body>
    </html>
  );
}
