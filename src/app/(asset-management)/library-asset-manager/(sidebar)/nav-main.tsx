"use client";

import {
  ChevronRight,
  ComputerIcon,
  ForkKnifeIcon,
  LibraryIcon,
  LucideIcon,
  StoreIcon,
  TestTubeIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { roleRedirectPaths } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type SubItem = {
  title: string;
  url: string;
  showIndicator: boolean;
  isVisible: boolean;
};

const basePathname = roleRedirectPaths[Role.LIBRARY_ASSET_CARETAKER];

export function NavMain() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive: boolean;
    isVisible: boolean;
    items: SubItem[];
  }[] = [
  
    {
      title: "Library asset management",
      url: "",
      icon: LibraryIcon,
      isActive: true,
      isVisible: true,
      items: [
        {
          title: "Overview",
          url: "",
          showIndicator: false,
          isVisible: true,
        },
        {
          title: "Book categories",
          url: "book-categories",
          showIndicator: false,
          isVisible: true,
        },
        {
          title: `Authors`,
          url: "authors",
          showIndicator: false,
          isVisible: true,
        },
        {
          title: "Borrowings",
          url: "borrowings",
          showIndicator: false,
          isVisible: true,
        },
        {
          title: `List of damages`,
          url: "list-of-damages",
          showIndicator: false,
          isVisible: true,
        },
      ],
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Asset managements</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const ItemIcon = item.icon;

          const baseUrl = basePathname + "/" + item.url;
          const isActive = item.items.some((i) => pathname.startsWith(baseUrl));
          const initialSubItem = item.items[0];
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className={cn("group/collapsible", !item.isVisible && "hidden")}
            >
              {/* TODO: If you want the dropdown trigger  a link also, uncomment the comments below. */}
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive}
                    asChild
                  >
                    <Link href={baseUrl + "?" + searchParams.toString()}>
                      <ItemIcon />
                      <span
                        className={cn(
                          isActive && "font-semibold",
                          "line-clamp-1 text-ellipsis break-words",
                        )}
                      >
                        {item.title}
                      </span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SubmenuItem
                      subItem={initialSubItem}
                      key={initialSubItem.url}
                      baseUrl={baseUrl}
                      isActive={pathname === baseUrl}
                    />
                    {item.items.slice(1).map((subItem) => {
                      const isChildActive = pathname.startsWith(
                        baseUrl + subItem.url,
                      );

                      return (
                        <SubmenuItem
                          subItem={subItem}
                          key={subItem.url}
                          baseUrl={baseUrl}
                          isActive={isChildActive}
                        />
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

interface SubmenuItemProps {
  subItem: SubItem;
  baseUrl: string;
  isActive: boolean;
}

function SubmenuItem({ subItem, baseUrl, isActive }: SubmenuItemProps) {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <SidebarMenuSubItem
      key={subItem.title}
      className={cn(!subItem.isVisible && "hidden")}
    >
      <SidebarMenuSubButton
        asChild
        isActive={isActive}
        onClick={() => startTransition(() => {})}
        className={cn(
          isPending &&
            "animate-pulse bg-sidebar-accent text-sidebar-accent-foreground",
        )}
      >
        <Link
          href={baseUrl + subItem.url + "?" + searchParams.toString()}
          className="flex w-full"
        >
          <span className={cn(isActive && "font-semibold")}>
            {subItem.title}
          </span>
          <span
            className={cn(
              "top-0 size-2 flex-none -translate-x-1/2 rounded-full bg-destructive",
              !subItem.showIndicator && "hidden",
            )}
          />
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
