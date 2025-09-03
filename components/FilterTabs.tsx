/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { ChevronDownIcon, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDashboard } from "@/context/Filtercontext";

const FilterTabs = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [tab, setTab] = useState("today");
  const { setFilterKey, setDate: setCtxDate } = useDashboard();

  useEffect(() => {
    if (tab === "custom" && date) {
      setCtxDate(date);
      setFilterKey("custom");
    } else {
      setCtxDate(undefined);
      setFilterKey(tab);
    }
  }, [tab, date]);

  return (
    <div className="flex-col sm:flex sm:flex-row text-right items-end  gap-2 self-center">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="rounded-full">
          <TabsTrigger value="today" className="rounded-full text-xs font-semibold">
            Today
          </TabsTrigger>
          <TabsTrigger value="thisMonth" className="rounded-full text-xs font-semibold">
            This Month
          </TabsTrigger>
          <TabsTrigger value="custom" className="rounded-full text-xs font-semibold">
            Custom
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="flex shadow-none w-48 justify-between font-normal rounded-full border-2 border-gray-300"
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {date
                  ? date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Select date"}
              </div>
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(selected) => {
                setDate(selected);
                setOpen(false);
                setTab("custom");
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default FilterTabs;
