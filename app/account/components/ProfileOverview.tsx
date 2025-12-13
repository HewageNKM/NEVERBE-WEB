import React from "react";
import { Customer } from "@/interfaces"; // Or wherever User/Customer is defined

interface ProfileOverviewProps {
  user: any; // Type properly
  setActiveTab: (tab: string) => void;
  ordersCount: number;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  user,
  setActiveTab,
  ordersCount,
}) => {
  return (
    <div className="space-y-12">
      <div className="border-b border-gray-200 pb-8">
        <h2 className="text-2xl font-medium uppercase tracking-tight mb-2">
          Member Profile
        </h2>
        <p className="text-gray-500">
          Member since{" "}
          {user.memberSince
            ? new Date(user.memberSince).toDateString()
            : "Recent"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-100 p-8 flex flex-col justify-between h-64">
          <h3 className="text-xl font-medium">Orders</h3>
          <p className="text-gray-600 mt-2">
            Track your recent purchases and view history.
          </p>
          <button
            onClick={() => setActiveTab("orders")}
            className="mt-auto self-start border-b border-black text-sm font-medium hover:text-gray-600 transition-colors"
          >
            View All ({ordersCount})
          </button>
        </div>
        <div className="bg-gray-100 p-8 flex flex-col justify-between h-64">
          <h3 className="text-xl font-medium">Settings</h3>
          <p className="text-gray-600 mt-2">
            Manage your profile, login details, and preferences.
          </p>
          <button
            onClick={() => setActiveTab("details")}
            className="mt-auto self-start border-b border-black text-sm font-medium hover:text-gray-600 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
