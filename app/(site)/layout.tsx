import "@/app/globals.css";
import StoreProvider from "@/app/(site)/components/StoreProvider";
import GlobalProvider from "@/app/(site)/components/GlobalProvider";
import ReCaptchaProviderWrapper from "@/app/(site)/components/ReCaptchaProvider";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReCaptchaProviderWrapper>
      <StoreProvider>
        <GlobalProvider>{children}</GlobalProvider>
      </StoreProvider>
    </ReCaptchaProviderWrapper>
  );
}

export const dynamic = "force-dynamic";
