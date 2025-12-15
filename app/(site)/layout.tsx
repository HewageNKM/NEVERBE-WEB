import "@/app/globals.css";
import GlobalProvider from "@/app/(site)/components/GlobalProvider";
import { getSeason } from "@/util/getSeason";
import { getNavigationConfig } from "@/services/WebsiteService";

import SeasonalAnimationsWrapper from "@/app/(site)/components/SeasonalAnimationsWrapper";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const season = getSeason();

  // Fetch navigation config server-side
  const navConfig = await getNavigationConfig().catch(() => ({
    mainNav: [],
    footerNav: [],
    socialLinks: [],
  }));

  return (
    <GlobalProvider
      season={season}
      mainNav={navConfig.mainNav}
      footerNav={navConfig.footerNav}
      socialLinks={navConfig.socialLinks || []}
    >
      <SeasonalAnimationsWrapper season={season} />
      {children}
    </GlobalProvider>
  );
}
