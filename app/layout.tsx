"use client";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import BottomBar from "@/components/Bottombar";
import { ThemeProvider } from "next-themes";
import './globals.css'
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DashboardProvider } from "@/context/Filtercontext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <DashboardProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex flex-col flex-1 min-w-0">
                <Topbar />
                <main className="flex-1 p-4 dark:bg-neutral-900 overflow-y-auto pb-16 md:pb-4">
                  <div className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Axis MF</div>
                  <Breadcrumbs/>
                  {children}
                </main>
              </div>
            </div>
            <BottomBar />
          </DashboardProvider>
        </ThemeProvider>
      </body> 
    </html>
  );
}