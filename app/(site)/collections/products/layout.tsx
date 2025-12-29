"use client";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <div className="w-full relative">{children}</div>;
};

export default Layout;
