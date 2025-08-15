"use client";
import React, { JSX, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "./ui/card";
import { PiLineVertical } from "react-icons/pi";
import { MdRocketLaunch, MdSettings, MdPauseCircle, MdHourglassTop } from "react-icons/md";
import { LuUserRoundCheck, LuShieldCheck } from "react-icons/lu";
import { useDashboard } from "@/context/Filtercontext";

const ICONS: Record<string, JSX.Element> = {
  "KYC Initiated": <MdRocketLaunch className="text-blue-700 h-6 w-6" />,
  "Under Process": <MdSettings className="text-orange-400 h-6 w-6" />,
  Registered: <LuUserRoundCheck className="text-sky-400 h-6 w-6 fill-sky-400 " />,
  Validated: <LuShieldCheck className="text-white h-6 w-6 fill-green-500" />,
  Hold: <MdPauseCircle className="text-cyan-400 h-6 w-6" />,
  "Docs Pending": <MdHourglassTop className="text-red-400 h-6 w-6" />,
};

export default function KYC_statusCards() {
  const { rawData } = useDashboard();
  const [period, setPeriod] = useState<"today" | "yesterday">("today");
  const [category, setCategory] = useState<"individual" | "nonIndividual">("individual");

  const kycData = (rawData as any)?.kycStatus;
  if (!kycData) return <div className="p-4">Loading...</div>;

  const statuses = kycData[period]?.[category] ?? [];

  return (
    <div className="bg-gray-100 dark:bg-zinc-800 m-4 p-3 rounded-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <Tabs value={period} onValueChange={(v: any) => setPeriod(v)}>
          <TabsList className="rounded-full bg-gray-200 dark:bg-zinc-700">
            <TabsTrigger value="today" className="rounded-full text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:bg-zinc-900 dark:data-[state=active]:text-white">Today</TabsTrigger>
            <TabsTrigger value="yesterday" className="rounded-full text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:bg-zinc-900 dark:data-[state=active]:text-white">Yesterday</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs value={category} onValueChange={(v: any) => setCategory(v)}>
          <TabsList className="rounded-full bg-gray-200 dark:bg-zinc-700">
            <TabsTrigger value="individual" className="rounded-full text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:bg-zinc-900 dark:data-[state=active]:text-white">Individual</TabsTrigger>
            <TabsTrigger value="nonIndividual" className="rounded-full text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:bg-zinc-900 dark:data-[state=active]:text-white">Non Individual</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="m-2 mt-4 p-3 rounded-sm shadow-none border-0 outline-0 bg-white dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <div className="flex items-stretch justify-between gap-4 min-w-max">
            {statuses.map((status: any, idx: number) => (
              <React.Fragment key={status.label}>
                <div className="flex flex-col items-start min-w-[80px] text-start">
                  {ICONS[status.label]}
                  <p className="text-[11px] font-semibold text-gray-500 mt-2 leading-tight text-start">
                    {status.label}
                  </p>
                  <span className="font-bold text-lg">{status.value}</span>
                </div>
                {idx !== statuses.length - 1 && (
                  <PiLineVertical className="text-gray-300 w-5 h-full self-center flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}