"use client";

import React from "react";
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

interface Item { name: string; value: number; fill: string }
interface Props {
  data: Item[];
  total?: number;
  size?: number;
}

export const RadialChart: React.FC<Props> = ({ data, total, size = 360 }) => {
  const innerRadius = "55%";
  const outerRadius = "100%";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full align-middle text-center self-center">
      <div
        className="relative align-middle text-center self-center flex-shrink-0 [&_.recharts-radial-bar-background-sector]:fill-[#e5e7eb] dark:[&_.recharts-radial-bar-background-sector]:fill-[#3f3f46]"
        style={{ width: size, height: size, minWidth: size, minHeight: size }}
      >
        <ResponsiveContainer width="100%" height="100%" className="w-full md:w-full sm:w-full align-middle self-center text-center">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            data={data}
            startAngle={90}
            endAngle={-270}
            className="w-full align-middle self-center text-center"
          >
            <RadialBar 
              dataKey="value" 
              cornerRadius={10} 
              background={{ 
                fill: "#f3f4f6"
              }} 
              className="dark:fill-[#3f3f46]"
            />
          </RadialBarChart>
        </ResponsiveContainer>
        {typeof total !== "undefined" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{total}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 flex-1 min-w-0 align-middle self-center text-center">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2 whitespace-nowrap">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ background: d.fill, display: "inline-block" }}
            />
            <span className="text-sm text-gray-900 dark:text-gray-200">{d.name}</span>
            <span className="text-sm font-semibold ml-2 text-gray-900 dark:text-gray-100">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
