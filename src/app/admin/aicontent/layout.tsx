"use client";
import React, { useState } from "react";
import DashSideNav from "./_components/SideNav";
import DashHeader from "./_components/Header";
import { TotalUsageContext } from "../../(context)/TotalUsageContext";

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [totalUsage, setTotalUsage] = useState<Number>(0);

  return (
    <TotalUsageContext.Provider value={{ totalUsage, setTotalUsage }}>
      <div className="bg-background h-screen">
        <DashHeader />
        {children}
      </div>
    </TotalUsageContext.Provider>
  );
}
