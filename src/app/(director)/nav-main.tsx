"use client";

import { ChevronRight, LifeBuoy, LucideIcon, User } from "lucide-react";

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
import { DirectorDashboardParam } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface NavMainProps {
  dashboardParams: DirectorDashboardParam;
}

export function NavMain({ dashboardParams }: NavMainProps) {
  const searchParams = useSearchParams();
  const basePathname = "/director/repository";
  const {
    academicYears,
    classStreams,
    classes,
    levels,
    streams,
    terms,
    pupils,
    teachingStaffs,
    nonTeachingStaffs,
  } = dashboardParams;

  type SubItem = {
    title: string;
    url: string;
    showIndicator: boolean;
    isVisible: boolean;
  };
  const items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive: boolean;
    isVisible: boolean;
    items: SubItem[];
  }[] = [
    {
      title: "Users",
      url: "students",
      icon: User,
      isActive:
        classStreams > 0 &&
        (pupils < 1 || teachingStaffs < 1 || nonTeachingStaffs < 1),
      isVisible: classStreams > 0,
      items: [
        {
          title: "Teaching Staffs",
          url: "teaching-staffs",
          showIndicator: teachingStaffs < 1,
          isVisible: true,
        },
        {
          title: "Non-teaching staffs",
          url: "non-teaching-staffs",
          showIndicator: nonTeachingStaffs < 1,
          isVisible: true,
        },
        {
          title: "Pupils and Students",
          url: "students",
          showIndicator: pupils < 1,
          isVisible: true,
        },
      ],
    },

    {
      title: "Utility",
      url: "levels",
      icon: LifeBuoy,
      isActive: classStreams < 1,
      isVisible: true,
      items: [
        {
          title: "Academic years",
          url: "years",
          showIndicator: academicYears < 1,
          isVisible: terms > 0 && streams > 0 && classes > 0,
        },
        {
          title: "Levels",
          url: "levels",
          showIndicator: levels < 1,
          isVisible: true,
        },
        {
          title: "Classes",
          url: "classes",
          showIndicator: classes < 1,
          isVisible: levels > 0,
        },
        {
          title: "Streams",
          url: "streams",
          showIndicator: streams < 1,
          isVisible: classes > 0,
        },
        {
          title: "Terms",
          url: "terms",
          showIndicator: terms < 1,
          isVisible: streams > 0,
        },
      ],
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Repositories</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const ItemIcon = item.icon;
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
                    //  asChild
                  >
                    {/* <Link href={basePathname+'/'+item.url+'?'+searchParams.toString()}> */}
                    <ItemIcon />
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    {/* </Link> */}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem
                        key={subItem.title}
                        className={cn(!subItem.isVisible && "hidden")}
                      >
                        <SidebarMenuSubButton asChild>
                          <Link
                            href={
                              basePathname +
                              "/" +
                              subItem.url +
                              "?" +
                              searchParams.toString()
                            }
                            className="flex w-full"
                          >
                            <span>{subItem.title}</span>
                            <span
                              className={cn(
                                "top-0 size-2 flex-none -translate-x-1/2 rounded-full bg-destructive",
                                !subItem.showIndicator && "hidden",
                              )}
                            />
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
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