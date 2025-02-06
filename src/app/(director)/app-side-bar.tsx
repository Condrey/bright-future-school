"use client";

import LoadingButton from "@/components/loading-button";
import { NavUser } from "@/components/nav-user";
import SideBarContentItemFallback from "@/components/sidebar/sidebar-content-item-fallback";
import RoleSwitcher from "@/components/switchers/role-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Suspense } from "react";
import { useDirectorDashboardParamsQuery } from "./hook";
import { NavMain } from "./nav-main";
import { NavManagements } from "./nav-managements";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, status, isRefetching, refetch } =
    useDirectorDashboardParamsQuery();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <RoleSwitcher />
      </SidebarHeader>
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
