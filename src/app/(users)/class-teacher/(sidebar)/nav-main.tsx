"use client";

import {
  ChevronRight,
  IdCardIcon,
  LucideIcon,
  PresentationIcon,
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

const basePathname = roleRedirectPaths[Role.CLASS_TEACHER];

export function NavMain() {
  const pathname = usePathname();

  const items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive: boolean;
    isVisible: boolean;
    items: SubItem[];
  }[] = [
    {
      title: "Class information",
      url: "class-info",
      icon: PresentationIcon,
      isActive: true,
      isVisible: true,
      items: [
        {
          title: "Pupils/ Students",
          url: "students",
          showIndicator: false,
          isVisible: true,
        },
        {
          title: `Subjects`,
          url: "subjects",
          showIndicator: false,
          isVisible: true,
        },
      ],
    },
    {
      title: "Report card Management",
      url: "report-card",
      icon: IdCardIcon,
      isActive: true,
      isVisible: true,
      items: [
        {
          title: "Tests & exams",
          url: "exams",
          showIndicator: false,
          isVisible: true,
        },
      ],
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Responsibilities</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const ItemIcon = item.icon;
          const isActive = item.items.some((i) =>
            pathname.startsWith(basePathname + "/" + i.url),
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
                    //  asChild
                  >
                    {/* <Link href={basePathname+'/'+item.url+'?'+searchParams.toString()}> */}
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
                    {/* </Link> */}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SubmenuItem subItem={subItem} key={subItem.url} />
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
}

function SubmenuItem({ subItem }: SubmenuItemProps) {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isActive = pathname.startsWith(basePathname + "/" + subItem.url);

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
          href={
            basePathname + "/" + subItem.url + "?" + searchParams.toString()
          }
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
