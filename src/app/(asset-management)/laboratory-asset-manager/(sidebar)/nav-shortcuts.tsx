"use client";

import { HistoryIcon, MoreHorizontal, type LucideIcon } from "lucide-react";

import TooltipContainer from "@/components/tooltip-container";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { roleRedirectPaths } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type ItemType = {
  name: string;
  url: string;
  icon: LucideIcon;
  disabled: boolean;
  toolTipMessage: React.ReactNode;
};
const redirectPathname = roleRedirectPaths[Role.BURSAR];
export function NavShortcuts() {
  const { isMobile } = useSidebar();
  const searchParams = useSearchParams();
  const currentYear = new Date().getFullYear();
  const [isPending, startTransition] = useTransition();
  const managements: ItemType[] = [
    {
      name: `${currentYear} fees defaulters`,
      url: "defaulters",
      icon: HistoryIcon,
      disabled: false,
      toolTipMessage: "",
    },
  ];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Shortcuts</SidebarGroupLabel>
      <SidebarMenu>
        {managements.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarMenuItem key={item.name}>
              {item.disabled ? (
                <div className="peer/menu-button ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm transition-[width,height,padding] outline-none group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0">
                  <Icon />
                  <TooltipContainer label={item.name}>
                    {item.toolTipMessage}
                  </TooltipContainer>
                </div>
              ) : (
                <MenuItemLink key={item.url} item={item} />
              )}
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

interface MenuItemLinkProps {
  item: ItemType;
}
function MenuItemLink({ item }: MenuItemLinkProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const basePathname = redirectPathname;
  const searchParams = useSearchParams();
  const Icon = item.icon;
  const isActive = pathname.startsWith(`${basePathname}/${item.url}`);

  return (
    <SidebarMenuButton
      asChild
      disabled={item.disabled}
      onClick={() => startTransition(() => {})}
      isActive={isActive}
      className={cn(
        isPending &&
          "bg-sidebar-accent text-sidebar-accent-foreground animate-pulse",
      )}
    >
      <Link
        href={basePathname + "/" + item.url + "?" + searchParams.toString()}
      >
        <Icon />
        <span className={cn(isActive && "font-extrabold")}>{item.name}</span>
      </Link>
    </SidebarMenuButton>
  );
}
