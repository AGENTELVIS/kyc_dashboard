"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import FilterTabs from "./FilterTabs";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  applications: "Applications",
  billing: "Billing",
  "rate-card": "Rate Card",
  "agreement-copy": "Agreement Copy",
  notices: "Notices",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="justify-between flex mt-0">
      <Breadcrumb className="self-center mt-0 hidden md:block">
        <BreadcrumbList className="flex self-center">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {segments.map((segment, idx) => {
            const href = "/" + segments.slice(0, idx + 1).join("/");
            const isLast = idx === segments.length - 1;
            const label = labelMap[segment] || segment.replace(/-/g, " ");

            return (
              <div key={href} className="flex items-center">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <FilterTabs/>
    </div>
  );
}
