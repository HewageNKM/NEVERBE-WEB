import "@/app/globals.css";
import StoreProvider from "@/app/(site)/components/StoreProvider";
import GlobalProvider from "@/app/(site)/components/GlobalProvider";
import ReCaptchaProviderWrapper from "@/app/(site)/components/ReCaptchaProvider";
import { redirect } from "next/navigation";
import axios from "axios";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    console.log("Fetching settings...");

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/settings`
    );
    const settings = res.data;

    console.log("Settings fetched:", settings);

    if (settings && settings.enable === false) {
      console.log("Maintenance mode ON, redirecting...");
      redirect("/maintenance");
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
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

export const dynamic = "force-dynamic";