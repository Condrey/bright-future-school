"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export interface HeaderContainerBreadCrumb {
  label: string;
  url?: string;
}
interface HeaderContainerProps {
  breadCrumbs?: HeaderContainerBreadCrumb[];
}

export default function HeaderContainer({
  breadCrumbs = [],
}: HeaderContainerProps) {
  const searchParams = useSearchParams();
  const basePathName = "/director";
  const breadCrumbItems: HeaderContainerBreadCrumb[] = [
    { label: "Home", url: "" },
    ...breadCrumbs,
  ];
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadCrumbItems.length === 1 ? (
              <BreadcrumbItem className="hidden sm:block">
                <BreadcrumbPage>{breadCrumbItems[0].label}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <>
                {breadCrumbItems.map((item, index, array) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <BreadcrumbItem className="hidden sm:block">
                      {index === array.length - 1 ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link
                            href={
                              basePathName +
                              item.url +
                              "?" +
                              searchParams.toString()
                            }
                          >
                            {item.label}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index !== array.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </div>
                ))}
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}

export function HeaderContainerFallback() {
  return (
    <div className="flex h-16 w-full shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <Skeleton className="size-6" />
      <Skeleton className="h-6 w-1" />
      <Skeleton className="h-6 w-28" />
      <BreadcrumbSeparator className="block" />
      <Skeleton className="h-6 w-56" />
      <BreadcrumbSeparator className="block" />
      <Skeleton className="h-6 w-64" />
    </div>
  );
}
