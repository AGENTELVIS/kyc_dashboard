"use client";

import React, { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { RadialChart } from "./RadialChart";
import PanData from "./PanData";
import { useDashboard } from "@/context/Filtercontext";

const SolicitedCard: React.FC = () => {
  const { getSection } = useDashboard();
  const [solType, setSolType] = useState<"solicited" | "unsolicited">("solicited");
  const [category, setCategory] = useState<"individual" | "nonIndividual">("individual");
  const data = getSection("panData");
  if (!data) return <div className="p-4">Loading...</div>;

  const piece = data?.[solType]?.[category] ?? {};
  const chartData = [
    { name: "Solicited", value: piece.solicited ?? 0, fill: "#2563eb" },
    { name: "Received", value: piece.received ?? 0, fill: "#059669" },
    { name: "Consumed", value: piece.consumed ?? 0, fill: "#dc2626" },
    { name: "Pending", value: piece.pending ?? 0, fill: "#ea580c" },
  ];

  // show kfinKRA if present on piece, otherwise fall back to top-level panStats/dataReceived
  const kfinKRA = piece.kfinKRA ?? "-";

  return (
    <Card className=" p-3 pb-4 h-full">
      <div className="flex items-center justify-between mb-0 mt-2">
        <div className="flex gap-3">
          <button
            onClick={() => setSolType("solicited")}
            className={`text-sm font-semibold mb-0 ${
              solType === "solicited" ? "underline text-black dark:text-white" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Solicited
          </button>
          <button
            onClick={() => setSolType("unsolicited")}
            className={`text-sm font-semibold mb-0 ${
              solType === "unsolicited" ? "underline text-black dark:text-white" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Unsolicited
          </button>
        </div>

        <Tabs value={category} onValueChange={(v) => setCategory(v as any)}>
          <TabsList className="rounded-full mb-0">
            <TabsTrigger value="individual" className="rounded-full text-xs font-semibold">
              Individual
            </TabsTrigger>
            <TabsTrigger value="nonIndividual" className="rounded-full text-xs font-semibold">
              Non Individual
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <CardContent className="p-0 mt-0">
        <div className="w-full justify-between">
          <RadialChart data={chartData} total={piece.total ?? 0} size={290} />
        </div>
      </CardContent>
      <CardContent>
        <div>
          <PanData  />
        </div>
      </CardContent>
    </Card>
  );
};

export default SolicitedCard;
