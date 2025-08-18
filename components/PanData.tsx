"use client";

import React, { useMemo } from "react";
import { FaIdCardClip } from "react-icons/fa6";
import { BiSolidLeftDownArrowCircle } from "react-icons/bi";
import { useDashboard } from "@/context/Filtercontext";

type PanStats = {
  withImage: number;
  withoutImage: number;
  kfinKRA?: number;
};

type PanDataPiece = {
  solicited?: number;
  received?: number;
  consumed?: number;
  pending?: number;
  total?: number;
  kfinKRA?: number;
};

type DashboardData = {
  panData?: {
    solicited?: {
      individual?: PanDataPiece;
      nonIndividual?: PanDataPiece;
    };
    unsolicited?: {
      individual?: PanDataPiece;
      nonIndividual?: PanDataPiece;
    };
  };
  panStats?: {
    solicited?: PanStats;
    dataReceived?: PanStats;
  };
};

const InfoInline: React.FC<{ label: string; value?: number }> = ({ label, value }) => (
  <div className="flex items-center gap-2 whitespace-nowrap min-w-[72px]">
    <span className="font-semibold">{value ?? 0}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

const PanData: React.FC = () => {
  const { rawData } = useDashboard();
  const data = rawData as DashboardData | null;
  if (!data) return <div className="p-4">Loading...</div>;

  const piece: PanDataPiece = data?.panData?.solicited?.individual ?? {
    solicited: 0,
    received: 0,
    consumed: 0,
    pending: 0,
    total: 0,
  };

  const solicitedStats: PanStats = {
    withImage: data?.panStats?.solicited?.withImage ?? 0,
    withoutImage: data?.panStats?.solicited?.withoutImage ?? 0,
    kfinKRA: data?.panStats?.solicited?.kfinKRA,
  };

  const receivedStats: PanStats = {
    withImage: data?.panStats?.dataReceived?.withImage ?? 0,
    withoutImage: data?.panStats?.dataReceived?.withoutImage ?? 0,
    kfinKRA: data?.panStats?.dataReceived?.kfinKRA,
  };
  const solicitedKfinKRA = piece.kfinKRA ?? receivedStats.kfinKRA ?? solicitedStats.kfinKRA ?? 0;
  const receivedKfinKRA = receivedStats.kfinKRA ?? piece.kfinKRA ?? solicitedStats.kfinKRA ?? 0;

  const totalSolicited = piece.total ?? piece.solicited ?? 0;
  const totalReceived = piece.received ?? 0;

  return (
    <div className="w-full lg:w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 inline-flex rounded-full bg-blue-100 text-blue-700 p-2 h-10 w-10">
            <FaIdCardClip className="align-middle items-center h-6 w-6 self-center"  style={{ display: "inline-block" }}/>
          </div>

          <div className="flex flex-col">
            <div className="text-[13px] font-semibold">No. Of PANs Solicited</div>
            <div className="mt-2 flex flex-wrap md:flex-nowrap items-center gap-2 text-xs">
              <InfoInline label="KFin KRA" value={solicitedKfinKRA} />
              <InfoInline label="With Image" value={solicitedStats.withImage} />
              <InfoInline label="Without Image" value={solicitedStats.withoutImage} />
            </div>
          </div>
        </div>

        <div className="flex items-center flex-shrink-0">
          <span className="text-lg font-bold">{totalSolicited}</span>
        </div>
      </div>

      <hr className="my-3 border-gray-200 mb-5 mt-4" />
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 inline-flex rounded-full bg-green-100 text-green-700 p-1 h-10 w-10">
            <BiSolidLeftDownArrowCircle className="h-8 w-8 slef-center" style={{ display: "inline-block" }}/>
          </div>

          <div className="flex flex-col">
            <div className="text-[13px] font-semibold">Data Received</div>

            <div className="mt-2 flex flex-wrap md:flex-nowrap items-center gap-2 text-xs">
              <InfoInline label="KFin KRA" value={receivedKfinKRA} />
              <InfoInline label="With Image" value={receivedStats.withImage} />
              <InfoInline label="Without Image" value={receivedStats.withoutImage} />
            </div>
          </div>
        </div>

        <div className="flex items-center flex-shrink-0">
          <span className="text-lg font-bold">{totalReceived}</span>
        </div>
      </div>
    </div>
  );
};

export default PanData;
