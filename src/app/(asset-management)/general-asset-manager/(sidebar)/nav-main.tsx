"use client";

import {
  ChevronRight,
  ComputerIcon,
  ForkKnifeIcon,
  LibraryIcon,
  LucideIcon,
  Package2Icon,
  ReceiptEuroIcon,
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

const basePathname = roleRedirectPaths[Role.ASSET_CARETAKER];

export function NavMain() {
  const pathname = usePathname();
  const searchParams = useSearchParams()

  const items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive: boolean;
    isVisible: boolean;
    items: SubItem[];
  }[] = [
    {
      title: "General asset Managements",
      url: "general-asset-management",
      icon: StoreIcon,
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
          title: "Sub assets",
          url: "/sub-assets",
          showIndicator: false,
          isVisible: true,
        },
        {
          title: `List of damages`,
          url: "/list-of-damages",
          showIndicator: false,
          isVisible: true,
        },
      ],
    },
    {
      title: "Library asset management",
      url: "library-asset-management",
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
          url: "/book-categories",
          showIndicator: false,
          isVisible: true,
        },
        {
          title: `Authors`,
          url: "/authors",
          showIndicator: false,
          isVisible: true,
        },
        {
          title: "Borrowings",
          url: "/borrowings",
          showIndicator: false,
          isVisible: true,
        },
        {
          title: `List of damages`,
          url: "/list-of-damages",
          showIndicator: false,
          isVisible: true,
        },
      ],
    },
    {
      title: "Computer Laboratory asset Managements",
      url: "computer-lab-asset-management",
      icon: ComputerIcon,
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
          title: "Brand models",
          url: "/brand-models",
          showIndicator: false,
          isVisible: true,
        },
        {
          title: `List of damages`,
          url: "/list-of-damages",
          showIndicator: false,
          isVisible: true,
        },
      ],
    },
    {
      title: "laboratory asset Managements",
      url: "laboratory-asset-management",
      icon: TestTubeIcon,
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
          title: `List of damages`,
          url: "/list-of-damages",
          showIndicator: false,
          isVisible: true,
        },
      ],
    },
    {
      title: "Food store asset Managements",
      url: "food-store-asset-management",
      icon: ForkKnifeIcon,
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
          title: "Food item suppliers",
          url: "/food-tem-suppliers",
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
         
          const baseUrl = basePathname+'/'+item.url;
           const isActive = item.items.some((i) =>
             pathname.startsWith(baseUrl ),
           );
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
                      {item.items?.map((subItem) => (
                        <SubmenuItem
                          subItem={subItem}
                          key={subItem.url}
                          baseUrl={baseUrl}
                        />
                      ))}
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
  baseUrl:string;
}

function SubmenuItem({ subItem ,baseUrl}: SubmenuItemProps) {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isActive = pathname.startsWith(baseUrl  + subItem.url);

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
