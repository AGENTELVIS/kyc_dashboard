"use client";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import BottomBar from "@/components/Bottombar";
import { ThemeProvider } from "next-themes";
import './globals.css'
import { DashboardProvider } from "@/context/Filtercontext";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <DashboardProvider>
            <UserProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex flex-col flex-1 min-w-0">
                  <Topbar />
                  
                  <main className="flex-1 p-4 dark:bg-neutral-900 overflow-y-auto pb-16 md:pb-4">
              
                    {children}
                  </main>
                
                </div>
              </div>
            </UserProvider>
            <BottomBar />
          </DashboardProvider>
        </ThemeProvider>
      </body> 
    </html>
  );
}