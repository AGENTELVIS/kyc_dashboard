"use client";

import { useEffect, useRef, useState } from "react";
import { MdBarChart, MdFormatListBulleted } from "react-icons/md";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboard } from "@/context/Filtercontext";
import DownloadDashboardPdf from "./pdf/DownloadDashboardPdf";

const chartConfig = {
  today: { label: "Today", color: "#2563eb" },
  yesterday: { label: "Yesterday", color: "#60a5fa" },
};

function pickyesterdayBar(barChart: any) {
  if (!barChart) return { individual: 0, nonIndividual: 0 };
  if (barChart.yesterday) return barChart.yesterday;

  const keys = Object.keys(barChart).filter((k) => k !== "today" && k !== "thisMonth");
  const dateKeys = keys.filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k)).sort();
  if (dateKeys.length) return barChart[dateKeys[dateKeys.length - 1]];

  if (keys.length) return barChart[keys[keys.length - 1]];

  return { individual: 0, nonIndividual: 0 };
}

export default function BarCharts() {
  const { getSection, rawData } = useDashboard();
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const allBars = (rawData as any)?.barChart ?? {};
    const currentBar = getSection("barChart") ?? { individual: 0, nonIndividual: 0 };
    const yesterdayBar = pickyesterdayBar(allBars);

    const formattedData = [
      {
        category: "Individual",
        today: currentBar.individual ?? 0,
        yesterday: yesterdayBar.individual ?? 0,
      },
      {
        category: "Non-Individual",
        today: currentBar.nonIndividual ?? currentBar["nonIndividual"] ?? 0,
        yesterday: yesterdayBar.nonIndividual ?? yesterdayBar["nonIndividual"] ?? 0,
      },
    ];
    setChartData(formattedData);
  }, [getSection, rawData]);

  if (loading) return <div className="p-4">Loading chart...</div>;

  return (
    <div>
      <Tabs defaultValue="chart" className="items-end rounded-full mr-5 " ref={dashboardRef}>
        <TabsList className="rounded-full h-10 w-20">
          <TabsTrigger value="chart" className="rounded-full">
            <MdBarChart />
          </TabsTrigger>
          <TabsTrigger value="list" className="rounded-full">
            <MdFormatListBulleted />
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <ChartContainer config={chartConfig} className="h-[300px] min-w-full w-full" >
        <ResponsiveContainer width="100%" height="100%" >
          <BarChart data={chartData} barCategoryGap="30%">
            <ChartLegend verticalAlign="top" align="center" content={<ChartLegendContent />} />

            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis />

            <ChartTooltip content={<ChartTooltipContent />} />

            <Bar dataKey="today" fill="#2563eb" radius={4} barSize={30} />
            <Bar dataKey="yesterday" fill="#60a5fa" radius={4} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
