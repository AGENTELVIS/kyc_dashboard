"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type FilterKey = "today" | "thisMonth" | "custom" | string;

type DashboardContextType = {
  rawData: any | null;              // full API JSON
  filterKey: FilterKey;            // "today" | "thisMonth" | "custom" | "YYYY-MM-DD"
  date?: Date;
  setFilterKey: (k: FilterKey) => void;
  setDate: (d?: Date) => void;
  // Helper: get section resolved for the currently selected filter
  getSection: (sectionName: string) => any;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawData, setRawData] = useState<any | null>(null);
  const [filterKey, setFilterKey] = useState<FilterKey>("today");
  const [date, setDate] = useState<Date | undefined>(undefined);

  // fetch raw JSON once (or could poll). We still re-resolve section with filter changes.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setRawData(json);
      })
      .catch(() => {
        if (!cancelled) setRawData(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // compute effective key (for "custom" with date convert to YYYY-MM-DD)
  const effectiveKey = useMemo(() => {
    if (filterKey === "custom" && date) {
      return date.toISOString().split("T")[0];
    }
    return filterKey;
  }, [filterKey, date]);

  // Helper to get a section resolved to the selected key:
  // - if rawData[section][effectiveKey] exists -> return it
  // - else if rawData[section].today exists -> return that
  // - else return rawData[section] or null
  const getSection = (sectionName: string) => {
    if (!rawData) return null;
    const section = rawData[sectionName];
    if (!section) return null;

    if (effectiveKey && section[effectiveKey] !== undefined) return section[effectiveKey];
    if (section.today !== undefined) return section.today;
    if (section.thisMonth !== undefined && effectiveKey === "thisMonth") return section.thisMonth;
    // if section itself is already shaped for UI (older shape), return whole section
    return section;
  };

  return (
    <DashboardContext.Provider
      value={{
        rawData,
        filterKey: effectiveKey,
        date,
        setFilterKey,
        setDate,
        getSection,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
};
