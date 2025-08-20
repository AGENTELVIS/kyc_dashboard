"use client";

import React, { useRef } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Total_KYC from "@/components/Total_KYC";
import DashboardRighSection from "@/components/DashboardRighSection";
import DownloadDashboardPdf from "@/components/pdf/DownloadDashboardPdf";

const Dashboard = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div className="text-xl font-bold text-gray-900 dark:text-gray-100 flex justify-between items-center mt-0">
        <span>Axis MF</span>

        {/* Button sits in header — DOES NOT wrap or change layout */}
        <DownloadDashboardPdf dashboardRef={dashboardRef} buttonClassName="px-4 py-2" />
      </div>

      <Breadcrumbs />

      <div
        ref={dashboardRef}
        id="download"
        className="flex flex-col lg:flex-row gap-2 bg-white dark:bg-neutral-900"
      >
        <Total_KYC />
        <DashboardRighSection />
      </div>
    </div>
  );
};

export default Dashboard;
