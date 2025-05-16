"use client";
import { useSession } from "@/app/session-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { PARAM_NAME_ROLE } from "@/lib/constants";
import { myPrivileges, roleRedirectPaths, userRoles } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import { ChevronsUpDown, Loader2Icon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export default function RoleSwitcher() {
  const isMobile = useIsMobile();
  const [isPending, startTransition] = useTransition();
  const { user } = useSession();
  if (!user) throw Error("Unauthorized");
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchRolePrams = searchParams.get(PARAM_NAME_ROLE);
  const items = myPrivileges[user.role];
  const activeRole =
    userRoles[items.find((i) => i === searchRolePrams) || items[0]];
  const ActiveLogo = activeRole.icon;

  const handleItemClick = (role: Role) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(PARAM_NAME_ROLE, role);
      router.push(`${roleRedirectPaths[role]}?${params.toString()}`);
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground max-w-sm"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {isPending ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <ActiveLogo className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeRole.label}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="max-h-72 w-[--radix-dropdown-menu-trigger-width] min-w-56 overflow-y-auto rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Choose privileges from among
              </DropdownMenuLabel>
              {items.map((item) => {
                const { icon, label, description } = userRoles[item];
                const Logo = icon;
                const isActive = item === searchRolePrams;

                return (
                  <DropdownMenuItem
                    key={item}
                    onClick={() => handleItemClick(item)}
                    disabled={isActive}
                    className={cn(
                      "gap-2 p-2",
                      isActive && "bg-accent text-accent-foreground",
                    )}
                  >
                    <div className="flex size-6 items-center justify-center">
                      <Logo className="size-4 shrink-0" />
                    </div>
                    <h6 className="line-clamp-1 break-words text-ellipsis">
                      {label}
                    </h6>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
