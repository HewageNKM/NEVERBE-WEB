"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  IoCubeOutline,
  IoSettingsOutline,
  IoTimeOutline,
  IoChevronForward,
} from "react-icons/io5";

interface UserProfile {
  name?: string;
  memberSince?: string | Date;
}

interface ProfileOverviewProps {
  user: UserProfile;
  setActiveTab: (tab: string) => void;
  ordersCount: number;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  user,
  setActiveTab,
  ordersCount,
}) => {
  // Format the creation date to match the original style
  const memberDate = React.useMemo(() => {
    return user?.memberSince
      ? new Date(user.memberSince).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
      : "RECENT INITIALIZATION";
  }, [user?.memberSince]);

  return (
    <div className="space-y-12 md:space-y-16 animate-fade">
      {/* HEADER: Member Blueprint Identity */}
      <div className="border-b border-white/5 pb-10">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent italic">
            Identity Protocol
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black uppercase italic tracking-tighter text-inverse leading-none">
            Member Blueprint
          </h2>
          <div className="flex items-center gap-2 mt-4 text-muted">
            <IoTimeOutline className="text-accent" />
            <p className="text-xs font-bold uppercase tracking-widest">
              Protocol Active Since{" "}
              <span className="text-inverse">{memberDate}</span>
            </p>
          </div>
        </div>
      </div>

      {/* GRID: Performance Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Orders Tile */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-surface-2 p-10 flex flex-col justify-between h-80 rounded-[2.5rem] border border-white/5 hover:border-accent hover:shadow-hover transition-all duration-500 group relative overflow-hidden"
        >
          {/* Background Decorative Icon */}
          <div className="absolute top-0 right-0 p-8 text-accent/5 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 group-hover:text-accent/10">
            <IoCubeOutline size={160} />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-dark rounded-2xl flex items-center justify-center text-accent mb-6 shadow-custom border border-accent/20">
              <IoCubeOutline size={24} />
            </div>
            <h3 className="text-3xl font-display font-black uppercase italic tracking-tighter text-inverse mb-4">
              Performance history
            </h3>
            <p className="text-muted font-medium text-sm leading-relaxed max-w-[240px]">
              Access your historical equipment logs and track active gear
              shipments.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("orders")}
            className="group relative z-10 self-start flex items-center gap-3 bg-dark text-accent border border-accent/20 px-8 py-3 rounded-full text-[10px] font-black uppercase italic tracking-widest hover:bg-accent hover:text-dark transition-all duration-300 shadow-custom"
          >
            View Logs ({ordersCount})
            <IoChevronForward className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Settings Tile */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-surface-2 p-10 flex flex-col justify-between h-80 rounded-[2.5rem] border border-white/5 hover:border-accent hover:shadow-hover transition-all duration-500 group relative overflow-hidden"
        >
          {/* Background Decorative Icon */}
          <div className="absolute top-0 right-0 p-8 text-accent/5 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 group-hover:text-accent/10">
            <IoSettingsOutline size={160} />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-dark rounded-2xl flex items-center justify-center text-accent mb-6 shadow-custom border border-accent/20">
              <IoSettingsOutline size={24} />
            </div>
            <h3 className="text-3xl font-display font-black uppercase italic tracking-tighter text-inverse mb-4">
              Blueprint Config
            </h3>
            <p className="text-muted font-medium text-sm leading-relaxed max-w-[240px]">
              Update your member credentials, security keys, and delivery
              protocols.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("details")}
            className="group relative z-10 self-start flex items-center gap-3 bg-dark text-accent border border-accent/20 px-8 py-3 rounded-full text-[10px] font-black uppercase italic tracking-widest hover:bg-accent hover:text-dark transition-all duration-300 shadow-custom"
          >
            Adjust Protocol
            <IoChevronForward className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* FOOTER: Technical Tip */}
      <div className="pt-8 border-t border-white/5 flex items-center gap-4 opacity-40">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted italic">
          Neverbe Member Lab // Authorized Access Only
        </p>
      </div>
    </div>
  );
};

export default ProfileOverview;
