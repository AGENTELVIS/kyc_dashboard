import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    totals: {
      today: { newKYC: { count: 120, change: 8.5 }, modifiedKYC: { count: 45, change: -3.2 } },
      thisMonth: { newKYC: { count: 3200, change: 12.4 }, modifiedKYC: { count: 980, change: 2.8 } },
      "2025-02-12": { newKYC: { count: 150, change: 10.1 }, modifiedKYC: { count: 55, change: 4.5 } },
      "2025-02-13": { newKYC: { count: 165, change: 9.2 }, modifiedKYC: { count: 60, change: -1.5 } }
    },

    barChart: {
      today: { individual: 75, nonIndividual: 45 },
      thisMonth: { individual: 1800, nonIndividual: 1400 },
      "2025-02-12": { individual: 85, nonIndividual: 55 },
      "2025-02-13": { individual: 90, nonIndividual: 65 },
    },
    kycStatus: {
      today: {
        individual: [
          { label: "KYC Initiated", value: 25 },
          { label: "Under Process", value: 40 },
          { label: "Registered", value: 35 },
          { label: "Validated", value: 50 },
          { label: "Hold", value: 10 },
          { label: "Docs Pending", value: 15 },
        ],
        nonIndividual: [
          { label: "KYC Initiated", value: 15 },
          { label: "Under Process", value: 30 },
          { label: "Registered", value: 25 },
          { label: "Validated", value: 40 },
          { label: "Hold", value: 5 },
          { label: "Docs Pending", value: 8 },
        ],
      },
      yesterday: {
        individual: [
          { label: "KYC Initiated", value: 20 },
          { label: "Under Process", value: 35 },
          { label: "Registered", value: 30 },
          { label: "Validated", value: 45 },
          { label: "Hold", value: 7 },
          { label: "Docs Pending", value: 12 },
        ],
        nonIndividual: [
          { label: "KYC Initiated", value: 12 },
          { label: "Under Process", value: 25 },
          { label: "Registered", value: 22 },
          { label: "Validated", value: 35 },
          { label: "Hold", value: 4 },
          { label: "Docs Pending", value: 6 },
        ],
      },
    },
    categories: {
      individual: {
        today: { RI: 78, NRI: 42 },
        thisMonth: { RI: 2400, NRI: 800 },
        "2025-02-12": { RI: 82, NRI: 50 },
        "2025-02-13": { RI: 88, NRI: 52 },
      },
      nonIndividual: {
        today: { RI: 85, NRI: 55 },
        thisMonth: { RI: 2000, NRI: 600 },
        "2025-02-12": { RI: 90, NRI: 58 },
        "2025-02-13": { RI: 95, NRI: 62 },
      },
    },
    panData: {
      solicited: {
        individual: {
          solicited: 220,
          received: 180,
          consumed: 140,
          pending: 20,
          total: 220,
          kfinKRA: 400,
        },
        nonIndividual: {
          solicited: 180,
          received: 140,
          consumed: 110,
          pending: 30,
          total: 180,
        },
      },
      unsolicited: {
        individual: {
          solicited: 120,
          received: 90,
          consumed: 70,
          pending: 10,
          total: 120,
        },
        nonIndividual: {
          solicited: 100,
          received: 90,
          consumed: 80,
          pending: 15,
          total: 100,
        },
      },
    },

    panStats: {
      solicited: {
        withImage: 80,
        withoutImage: 40,
      },
      dataReceived: {
        withImage: 90,
        withoutImage: 30,
        kfinKRA: 350,
      },
    },
  };

  return NextResponse.json(data);
}
