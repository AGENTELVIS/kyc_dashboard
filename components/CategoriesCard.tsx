"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDashboard } from "@/context/Filtercontext";
import DownloadDashboardPdf from "./pdf/DownloadDashboardPdf";

function pickCompareCategory(categoryObj: any) {
  if (!categoryObj) return { RI: 0, NRI: 0 };
  if (categoryObj.yesterday) return categoryObj.yesterday;

  const keys = Object.keys(categoryObj).filter((k) => k !== "today" && k !== "thisMonth");
  const dateKeys = keys.filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k)).sort();
  if (dateKeys.length) return categoryObj[dateKeys[dateKeys.length - 1]];
  if (keys.length) return categoryObj[keys[keys.length - 1]];

  return categoryObj.thisMonth || { RI: 0, NRI: 0 };
}

const CategoriesCard = () => {
  const { getSection, filterKey } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"individual" | "nonIndividual">("individual");
  const dashboardRef = useRef<HTMLDivElement>(null);


  if (loading) {
    return <div className="p-4">Loading...</div>;
  }
  const categories = getSection("categories");
  if (!categories) return <div className="p-4">No categories data</div>;

  const categoryData = categories[activeCategory] || {};
  const current = categoryData[filterKey] || categoryData.today || { RI: 0, NRI: 0 };
  const today = current;
  const compare = pickCompareCategory(categoryData);

  return (
    <TooltipProvider>
      <Card className="mt-4 w-full flex mr-6" ref={dashboardRef}>
        <div className="flex justify-between m-3 mt-0 mb-0 gap-26">
          <h2 className="font-bold self-center mb-0">Categories</h2>
          <Tabs
            value={activeCategory}
            onValueChange={(value: any) => setActiveCategory(value)}
            className="mb-0"
          >
            <TabsList className="rounded-full">
              <TabsTrigger value="individual" className="rounded-full text-xs font-semibold">
                Individual
              </TabsTrigger>
              <TabsTrigger value="nonIndividual" className="rounded-full text-xs font-semibold">
                Non Individual
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tooltip>
          <TooltipTrigger asChild >
            <div className="m-3 mt-0 mb-0 cursor-pointer" >
              <div className="flex justify-between items-center mb-1">
                <p className="text-[12px] text-gray-500 font-semibold">RI</p>
              </div>
              <Progress value={today.RI ?? 0} className="mb-1 h-2 [&>div]:bg-[#2563eb]" />
              <Progress value={compare.RI ?? 0} className="h-2 [&>div]:bg-[#60a5fa]" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              RI - Today: {today.RI ?? 0}%, Compare: {compare.RI ?? 0}%
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="m-3 mt-0 cursor-pointer">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[12px] text-gray-500 font-semibold">NRI</p>
              </div>
              <Progress value={today.NRI ?? 0} className="mb-1 h-2 [&>div]:bg-[#2563eb]" />
              <Progress value={compare.NRI ?? 0} className="h-2 [&>div]:bg-[#60a5fa]" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              NRI - Today: {today.NRI ?? 0}%, Compare: {compare.NRI ?? 0}%
            </p>
          </TooltipContent>
        </Tooltip>
      </Card>
    </TooltipProvider>
  );
};

export default CategoriesCard;
