import "@/app/globals.css";
import StoreProvider from "@/app/(site)/components/StoreProvider";
import GlobalProvider from "@/app/(site)/components/GlobalProvider";
import ReCaptchaProviderWrapper from "@/app/(site)/components/ReCaptchaProvider";


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ReCaptchaProviderWrapper>
        <StoreProvider>
          <GlobalProvider>{children}</GlobalProvider>
        </StoreProvider>
      </ReCaptchaProviderWrapper>
    </>
  );
}
