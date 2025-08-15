"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BsArrowDownLeftCircleFill } from "react-icons/bs";
import { PiClockClockwise } from "react-icons/pi";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import BarChartComponent from "@/components/BarChart";
import KYC_statusCards from "./KYC_statusCards";
import { useDashboard } from "@/context/Filtercontext";

export default function Total_KYC() {
  const { getSection, rawData } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [activeCard, setActiveCard] = useState<"new" | "modified" | null>("new");

  // resolved section for current filter (e.g., today/thisMonth/yyy-mm-dd)
  const totalsToday = getSection("totals") ?? {};

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!totalsToday) {
    return <div className="p-6">No data</div>;
  }

  const newKYC = totalsToday?.newKYC ?? { count: 0, change: 0 };
  const modifiedKYC = totalsToday?.modifiedKYC ?? { count: 0, change: 0 };

  const totalCount = (newKYC.count ?? 0) + (modifiedKYC.count ?? 0);

  // Optional fields that might not exist in new shape - show fallback
  const myKRA =
    modifiedKYC?.myKRA ??
    (rawData as any)?.panStats?.dataReceived?.kfinKRA ??
    (rawData as any)?.panData?.solicited?.individual?.kfinKRA ??
    "-";
  const interop =
    modifiedKYC?.interop ??
    (rawData as any)?.panData?.solicited?.individual?.consumed ??
    (rawData as any)?.panData?.unsolicited?.individual?.consumed ??
    "-";

  return (
    <Card className="mt-4 w-full max-w-full lg:w-4/7 min-h-[420px] bg-white dark:bg-zinc-900">
      <CardContent className="p-4 pt-0 pb-0">
        <p className="text-xs text-gray-500 dark:text-gray-300 font-semibold rounded-sm">Total KYCs</p>
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalCount}</span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-100 dark:bg-zinc-800 p-3 mt-4 rounded-sm">
          {/* New KYC */}
          <div
            onClick={() => setActiveCard("new")}
            className={cn(
              "bg-gray-100 dark:bg-zinc-800 p-4 cursor-pointer transition-all duration-300 rounded-sm",
              activeCard === "new" ? "shadow-sm scale-[1.02] bg-white dark:bg-zinc-700" : "opacity-80 hover:opacity-100"
            )}  
          >
            <div className="flex items-start gap-2 flex-wrap">
              <BsArrowDownLeftCircleFill className="text-blue-600 h-7 w-7 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">New KYC</span>
              <span className="ml-1 bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400 flex items-center rounded-sm px-1.5 py-0.5 text-xs flex-shrink-0">
                <ChevronsUp className="h-3 w-3 mr-0.5" />
                {(newKYC.change ?? 0)}
                %
              </span>
            </div>
            <p className="text-lg font-bold ml-8 mt-2 text-gray-900 dark:text-gray-100">{newKYC.count ?? 0}</p>
          </div>

          {/* Modified KYC */}
          <div
            onClick={() => setActiveCard("modified")}
            className={cn(
              "bg-gray-100 dark:bg-zinc-800 p-4 cursor-pointer transition-all duration-300 rounded-sm",
              activeCard === "modified"
                ? "shadow-sm scale-[1.02] bg-white dark:bg-zinc-700"
                : "opacity-80 hover:opacity-100"
            )}
          >
            <div className="flex items-start gap-2 flex-wrap">
              <PiClockClockwise className="bg-blue-600 text-white rounded-full p-1 h-7 w-7 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Modified KYC</span>
              <span className="ml-1 bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 flex items-center rounded-sm px-1.5 py-0.5 text-xs flex-shrink-0">
                <ChevronsDown className="h-3 w-3 mr-0.5" />
                {Math.abs(modifiedKYC.change ?? 0)}%
              </span>
            </div>
            <p className="text-lg font-bold ml-8 mt-2 text-gray-900 dark:text-gray-100">{modifiedKYC.count ?? 0}</p>
            <div className="mt-2 ml-8 flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs text-gray-600">
              <p className="text-gray-700 dark:text-gray-300">My KRA: {myKRA}</p>
              <p className="text-gray-700 dark:text-gray-300">Interop: {interop}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <BarChartComponent />
      <KYC_statusCards />
    </Card>
  );
}
