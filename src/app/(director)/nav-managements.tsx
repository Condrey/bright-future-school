"use client";

import {
  CircleDollarSign,
  MoreHorizontal,
  Package,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";

import TooltipContainer from "@/components/tooltip-container";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { DirectorDashboardParam } from "@/lib/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface NavManagementsProps {
  dashboardParams: DirectorDashboardParam;
}
export function NavManagements({ dashboardParams }: NavManagementsProps) {
  const { isMobile } = useSidebar();
  const { pupils } = dashboardParams;
  const searchParams = useSearchParams();
  const basePathname = "/director/management";

  const managements: {
    name: string;
    url: string;
    icon: LucideIcon;
    disabled: boolean;
    toolTipMessage: React.ReactNode;
  }[] = [
    {
      name: "Fees management",
      url: "fees-management",
      icon: CircleDollarSign,
      disabled: pupils < 1,
      toolTipMessage: (
        <p>
          Before Managing fees, you need to have{" "}
          <cite>students and or pupils</cite> in the database first.{" "}
          <Link
            href={`/director/repository/students?${searchParams.toString()}`}
            className="underline"
          >
            Click here to add
          </Link>
        </p>
      ),
    },
    {
      name: "Asset Management",
      url: "asset-management",
      icon: Package,
      disabled: false,
      toolTipMessage: "",
    },
    {
      name: "Report card Management",
      url: "report-card-management",
      icon: ReceiptText,
      disabled: pupils < 1,
      toolTipMessage: (
        <p>
          Before Managing report cards, you need to have{" "}
          <cite>students and or pupils</cite> in the database first.{" "}
          <Link
            href={`/director/repository/students?${searchParams.toString()}`}
            className="underline"
          >
            Click here to add
          </Link>
        </p>
      ),
    },
  ];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Managements</SidebarGroupLabel>
      <SidebarMenu>
        {managements.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarMenuItem key={item.name}>
              {item.disabled ? (
                <div className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0">
                  <Icon />
                  <TooltipContainer label={item.name}>
                    {item.toolTipMessage}
                  </TooltipContainer>
                </div>
              ) : (
                <SidebarMenuButton asChild disabled={item.disabled}>
                  <Link
                    href={
                      basePathname +
                      "/" +
                      item.url +
                      "?" +
                      searchParams.toString()
                    }
                  >
                    <Icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              )}
              {/* TODO: think about this amazing ui coundrey */}
              {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Management</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Management</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Management</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
            </SidebarMenuItem>
          );
        })}
        {managements.length > 3 && (
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
