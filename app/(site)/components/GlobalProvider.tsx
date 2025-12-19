"use client";
import { ReactNode, useEffect } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { initializeBag } from "@/redux/bagSlice/bagSlice";
import { AnimatePresence } from "framer-motion";
import Bag from "@/components/Bag";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Menu from "@/components/Menu";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NavigationItem, SocialMediaItem } from "@/services/WebsiteService";
import { PromotionsProvider } from "@/components/PromotionsProvider";
import QuickViewProvider from "@/components/QuickViewProvider";
import RecentlyViewedProvider from "@/components/RecentlyViewedProvider";

interface GlobalProviderProps {
  children: ReactNode;
  season: "christmas" | "newYear" | null;
  mainNav?: NavigationItem[];
  footerNav?: NavigationItem[];
  socialLinks?: SocialMediaItem[];
}

const GlobalProvider = ({
  children,
  season,
  mainNav = [],
  footerNav = [],
  socialLinks = [],
}: GlobalProviderProps) => {
  const dispatch: AppDispatch = useDispatch();

  const showBag = useSelector((state: RootState) => state.bag.showBag);
  const showMenu = useSelector(
    (state: RootState) => state.headerSlice.showMenu
  );

  useEffect(() => {
    dispatch(initializeBag());
  }, []);

  return (
    <main className="w-full relative flex flex-col justify-between min-h-screen overflow-clip">
      <PromotionsProvider>
        <RecentlyViewedProvider>
          <QuickViewProvider>
            <Header season={season} mainNav={mainNav} />
            {children}
            <Footer footerNav={footerNav} socialLinks={socialLinks} />
            <AnimatePresence>{showBag && <Bag />}</AnimatePresence>
            <AnimatePresence>
              {showMenu && <Menu mainNav={mainNav} />}
            </AnimatePresence>
            <Analytics />
            <SpeedInsights />
          </QuickViewProvider>
        </RecentlyViewedProvider>
      </PromotionsProvider>
    </main>
  );
};

export default GlobalProvider;
