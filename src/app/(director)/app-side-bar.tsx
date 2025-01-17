"use client";

import LoadingButton from "@/components/loading-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { useDirectorDashboardParamsQuery } from "./hook";
import { NavMain } from "./nav-main";
import { NavManagements } from "./nav-managements";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, status, isRefetching, refetch } =
    useDirectorDashboardParamsQuery();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>{/* <LevelSwitcher /> */}</SidebarHeader>
      <SidebarContent>
        {status === "pending" ? (
          <div className="flex flex-col gap-6 px-4 py-6">
            {Array.from({ length: 3 }, (_, index) => (
              <SideBarContentItemFallback key={index} />
            ))}
          </div>
        ) : status === "error" ? (
          <div className="flex size-full flex-col items-center justify-center gap-4">
            <span className="text-muted-foreground">
              Error fetching sidebar.
            </span>
            <LoadingButton loading={isRefetching} onClick={() => refetch()}>
              Refetch
            </LoadingButton>
          </div>
        ) : (
          <>
            {!!data.classStreams && <NavManagements dashboardParams={data} />}
            <Suspense fallback={<SideBarContentItemFallback />}>
              <NavMain dashboardParams={data} />
            </Suspense>
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function SideBarContentItemFallback() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-3/4" />
      <div className="space-y-2">
        <div className="flex gap-2">
          <Skeleton className="size-8" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="w-full space-y-2 pl-2">
          {Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
