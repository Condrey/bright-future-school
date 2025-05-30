"use client";

import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { PARAM_NAME_LEVEL } from "@/lib/constants";
import { AudioWaveform, Blocks, Columns4, Command } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function LevelSwitcher() {
  const { isMobile } = useSidebar();
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchParamLevel = searchParams.get(PARAM_NAME_LEVEL) ?? undefined;
  const levels = [
    {
      name: "All",
      logo: Columns4,
    },
    {
      name: "Kindergarten",
      logo: Blocks,
    },
    {
      name: "Primary",
      logo: AudioWaveform,
    },
    {
      name: "Secondary",
      logo: Command,
    },
  ];
  const activeLevel =
    levels.find(
      (l) => l.name.toLowerCase() === searchParamLevel?.toLowerCase(),
    ) || levels[0];

  const ActiveLogo = activeLevel.logo;

  const handleLevelClick = (level: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(PARAM_NAME_LEVEL, level.toLowerCase());
    router.push(`/director?${params.toString()}`);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <ActiveLogo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeLevel.name}
                </span>
                <span className="truncate text-xs">Level</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Levels
            </DropdownMenuLabel>
            {levels.map((level) => {
              const Logo = level.logo;
              return (
                <DropdownMenuItem
                  key={level.name}
                  onClick={() => handleLevelClick(level.name)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Logo className="size-4 shrink-0" />
                  </div>
                  {level.name}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add level</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
