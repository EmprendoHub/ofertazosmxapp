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
  return (
    <div className="bg-background h-screen">
      <DashHeader />
      {children}
    </div>
  );
}
