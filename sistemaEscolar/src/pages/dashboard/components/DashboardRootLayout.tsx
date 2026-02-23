import React from "react";
import {Outlet} from "react-router-dom";
import {ThemeProvider} from "next-themes";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster as Sonner} from "@/components/ui/sonner";

const queryClient = new QueryClient();

export const DashboardRootLayout = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner />
          <Outlet />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
