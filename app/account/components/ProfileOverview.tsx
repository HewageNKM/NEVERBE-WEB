"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  IoCubeOutline,
  IoSettingsOutline,
  IoTimeOutline,
  IoChevronForward,
} from "react-icons/io5";
import { Button, Row, Col, Typography, Card } from "antd";

const { Title, Text } = Typography;

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
        <Text className="block text-[10px] font-black uppercase tracking-[0.3em] text-accent">
          Dashboard
        </Text>
        <Title
          level={2}
          className="text-3xl! md:text-4xl! font-display! font-black! uppercase! tracking-tighter! text-primary! mt-2! mb-0!"
        >
          Member Overview
        </Title>
        <div className="flex items-center gap-2 mt-4 text-muted">
          <IoTimeOutline className="text-accent" />
          <Text className="text-xs font-bold uppercase tracking-widest text-muted">
            Member since <span className="text-primary">{memberDate}</span>
          </Text>
        </div>
      </div>

      {/* Grid */}
      <Row gutter={[24, 24]}>
        {/* Orders Tile */}
        <Col xs={24} md={12}>
          <motion.div whileHover={{ y: -4 }}>
            <Card
              bordered={false}
              className="bg-white flex flex-col justify-between min-h-[280px] rounded-2xl border border-default hover:border-[#2e9e5b] transition-all duration-300 group relative overflow-hidden h-full shadow-none hover:shadow-none"
              bodyStyle={{
                padding: "32px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="absolute top-0 right-0 p-6 text-accent/10 transition-transform duration-500 group-hover:scale-110">
                <IoCubeOutline size={120} />
              </div>

              <div className="relative z-10 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#2e9e5b] mb-4 border border-default">
                  <IoCubeOutline size={24} />
                </div>
                <Title
                  level={3}
                  className="text-2xl! font-display! font-black! uppercase! tracking-tighter! text-primary! mb-3!"
                >
                  Order History
                </Title>
                <Text className="text-muted font-medium text-sm leading-relaxed block">
                  View your past orders and track active shipments.
                </Text>
              </div>

              <Button
                type="primary"
                onClick={() => setActiveTab("orders")}
                className="group relative z-10 self-start flex items-center gap-2 bg-[#2e9e5b] text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#26854b] shadow-md hover:shadow-lg transition-all border-none h-auto active:scale-[0.98]"
              >
                View Orders ({ordersCount})
                <IoChevronForward className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </motion.div>
        </Col>

        {/* Settings Tile */}
        <Col xs={24} md={12}>
          <motion.div whileHover={{ y: -4 }}>
            <Card
              bordered={false}
              className="bg-white flex flex-col justify-between min-h-[280px] rounded-2xl border border-default hover:border-[#2e9e5b] transition-all duration-300 group relative overflow-hidden h-full shadow-none hover:shadow-none"
              bodyStyle={{
                padding: "32px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="absolute top-0 right-0 p-6 text-accent/10 transition-transform duration-500 group-hover:scale-110">
                <IoSettingsOutline size={120} />
              </div>

              <div className="relative z-10 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#2e9e5b] mb-4 border border-default">
                  <IoSettingsOutline size={24} />
                </div>
                <Title
                  level={3}
                  className="text-2xl! font-display! font-black! uppercase! tracking-tighter! text-primary! mb-3!"
                >
                  Account Settings
                </Title>
                <Text className="text-muted font-medium text-sm leading-relaxed block">
                  Update your profile, password, and preferences.
                </Text>
              </div>

              <Button
                type="primary"
                onClick={() => setActiveTab("details")}
                className="group relative z-10 self-start flex items-center gap-2 bg-[#2e9e5b] text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#26854b] shadow-md hover:shadow-lg transition-all border-none h-auto active:scale-[0.98]"
              >
                Manage Settings
                <IoChevronForward className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileOverview;
