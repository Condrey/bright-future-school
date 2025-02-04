"use client";

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { assetCategories } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { AssetCategory } from "@prisma/client";
import { HammerIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ListItem, NavItem } from "./list-item";

export default function VandalismNavItem({
  assetCategory,
}: {
  assetCategory: AssetCategory;
}) {
  const navList: NavItem[] = [
    {
      label: "List of damages",
      url: "/damages",
      description: `Table showing all ${assetCategories[assetCategory].label} asset variant damages and payments made to cover damages.`,
    },
    {
      label: "Vandalizers list",
      url: "/vandalizers",
      description: `Concise representation of ${assetCategories[assetCategory].label} asset damagers.`,
    },
    {
      label: "Payment history",
      url: "/payments",
      description: `Table showing all ${assetCategories[assetCategory].label} asset repair payments made overtime.`,
    },
  ];

  const Icon = assetCategories[assetCategory].icon;

  const basePathname =
    "/director/management/asset-management/store/" +
    assetCategory.toLowerCase() +
    "/vandalism";

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const isParentActive = pathname.startsWith(basePathname);

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          isParentActive &&
            "rounded-md bg-accent px-2 py-1 text-accent-foreground",
        )}
      >
        <div className="flex items-center">
          {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
          <span>Vandalism</span>
        </div>
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
          <li className="row-span-3">
            <NavigationMenuLink
              onClick={() => startTransition(() => {})}
              asChild
            >
              <Link
                href={basePathname + "?" + searchParams.toString()}
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
              >
                <div className="flex w-full items-center justify-center">
                  <HammerIcon className="size-12" strokeWidth={0.8} />
                  <Icon className="my-auto size-4" />
                </div>
                <div className="mb-2 mt-4 w-full text-center text-lg font-medium">
                  Vandalism overview
                </div>
                <p className="text-pretty text-sm leading-tight text-muted-foreground">
                  An overview using cards, graphs and tables to show{" "}
                  {assetCategories[assetCategory].label}'s damages overtime.
                </p>
              </Link>
            </NavigationMenuLink>
          </li>
          {navList.map((item) => {
            const path = basePathname + item.url;
            const isActive = pathname.startsWith(path);
            return (
              <ListItem
                key={item.url}
                href={path + "?" + searchParams.toString()}
                onClick={() => startTransition(() => {})}
                title={item.label}
                className={cn(isActive && "bg-accent text-accent-foreground")}
              >
                {item.description}
              </ListItem>
            );
          })}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
