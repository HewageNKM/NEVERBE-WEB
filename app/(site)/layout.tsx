import "@/app/globals.css";
import StoreProvider from "@/app/(site)/components/StoreProvider";
import GlobalProvider from "@/app/(site)/components/GlobalProvider";

import SeasonalAnimations from "@/app/(site)/components/SeasonalAnimations";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <GlobalProvider>
        <SeasonalAnimations />
        {children}
      </GlobalProvider>
    </StoreProvider>
  );
}
