// app/layout.tsx
import "@/app/globals.css";
import StoreProvider from "@/app/(site)/components/StoreProvider";
import GlobalProvider from "@/app/(site)/components/GlobalProvider";
import ReCaptchaProviderWrapper from "@/app/(site)/components/ReCaptchaProvider";
import { redirect } from "next/navigation";
import axios from "axios";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/settings`);
    const settings = res.data;

    if (settings && settings.enable === false) {
      redirect("/maintenance");
    }
  } catch (error) {
    // Redirect if fetching fails
    redirect("/maintenance");
  }

  return (
    <ReCaptchaProviderWrapper>
      <StoreProvider>
        <GlobalProvider>{children}</GlobalProvider>
      </StoreProvider>
    </ReCaptchaProviderWrapper>
  );
}
