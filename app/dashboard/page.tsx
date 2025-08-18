"use client";

import { Button } from "@/components/ui/button";
import Total_KYC from "@/components/Total_KYC";
import DashboardRighSection from "@/components/DashboardRighSection";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaFileDownload } from 'react-icons/fa';

const Dashboard = () => {
  const handleDownload = async () => {
    const element = document.getElementById("download");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2, useCORS: true  });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");
    const margin = 15;
    const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, pdfHeight);
    pdf.save("dashboard.pdf");
  };

  return (
    <div>
      <div className="text-xl font-bold text-gray-900 dark:text-gray-100 justify-between flex align-bottom mt-0">Axis MF 
        <Button onClick={handleDownload} variant="default" className=" text-[12px] self-center mb-2 rounded-full">
          Export to PDF <FaFileDownload />
        </Button>
      </div>
                  
        <Breadcrumbs/>
      

      <div id="download" className="flex flex-col lg:flex-row gap-2 bg-white dark:bg-neutral-900">
        <Total_KYC />
        <DashboardRighSection />
      </div>
    </div>
  );
};

export default Dashboard;
