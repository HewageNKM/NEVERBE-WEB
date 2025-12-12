import "@/app/globals.css";
import AuthProvider from "@/components/AuthProvider";
import StoreProvider from "@/app/(site)/components/StoreProvider";
import GlobalProvider from "@/app/(site)/components/GlobalProvider";
import { getSeason } from "@/util/getSeason";

import SeasonalAnimationsWrapper from "@/app/(site)/components/SeasonalAnimationsWrapper";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const season = getSeason();

  return (
    <StoreProvider>
      <AuthProvider>
        <GlobalProvider season={season}>
          <SeasonalAnimationsWrapper season={season} />
          {children}
        </GlobalProvider>
      </AuthProvider>
    </StoreProvider>
  );
}
