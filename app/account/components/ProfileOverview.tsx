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
  const memberDate = React.useMemo(() => {
    return user?.memberSince
      ? new Date(user.memberSince).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
      : "New Member";
  }, [user?.memberSince]);

  return (
    <div className="space-y-12 animate-fade">
      {/* Header */}
      <div className="border-b border-default pb-8">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
          Dashboard
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-black uppercase italic tracking-tighter text-primary mt-2">
          Member Overview
        </h2>
        <div className="flex items-center gap-2 mt-4 text-muted">
          <IoTimeOutline className="text-accent" />
          <p className="text-xs font-bold uppercase tracking-widest">
            Member since <span className="text-primary">{memberDate}</span>
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders Tile */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-surface-2 p-8 flex flex-col justify-between min-h-[280px] rounded-2xl border border-default hover:border-accent transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 text-accent/10 transition-transform duration-500 group-hover:scale-110">
            <IoCubeOutline size={120} />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center text-accent mb-4 border border-default">
              <IoCubeOutline size={24} />
            </div>
            <h3 className="text-2xl font-display font-black uppercase italic tracking-tighter text-primary mb-3">
              Order History
            </h3>
            <p className="text-muted font-medium text-sm leading-relaxed">
              View your past orders and track active shipments.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("orders")}
            className="group relative z-10 self-start flex items-center gap-2 bg-dark text-inverse px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-dark transition-all"
          >
            View Orders ({ordersCount})
            <IoChevronForward className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Settings Tile */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-surface-2 p-8 flex flex-col justify-between min-h-[280px] rounded-2xl border border-default hover:border-accent transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 text-accent/10 transition-transform duration-500 group-hover:scale-110">
            <IoSettingsOutline size={120} />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center text-accent mb-4 border border-default">
              <IoSettingsOutline size={24} />
            </div>
            <h3 className="text-2xl font-display font-black uppercase italic tracking-tighter text-primary mb-3">
              Account Settings
            </h3>
            <p className="text-muted font-medium text-sm leading-relaxed">
              Update your profile, password, and preferences.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("details")}
            className="group relative z-10 self-start flex items-center gap-2 bg-dark text-inverse px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-dark transition-all"
          >
            Manage Settings
            <IoChevronForward className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileOverview;
