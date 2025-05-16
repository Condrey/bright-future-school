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
import { Loader2Icon, PackageIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ListItem } from "./list-item";

const basePathname = "/director/management/asset-management";

export default function AllAssetsNavItem() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>
        <div className="flex items-center">
          {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
          <span>Asset management</span>
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
                className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
              >
                <PackageIcon className="size-12" strokeWidth={0.8} />
                <div className="mt-4 mb-2 text-lg font-medium">All assets</div>
                <p className="text-muted-foreground text-sm leading-tight">
                  A one-stop-point for efficiently managing and analyzing all
                  school assets.
                </p>
              </Link>
            </NavigationMenuLink>
          </li>
          {Object.values(AssetCategory).map((category) => {
            const path = basePathname + "/store/" + category.toLowerCase();
            const isActive = pathname.startsWith(path);
            return (
              <ListItem
                key={category}
                href={path + "?" + searchParams.toString()}
                onClick={() => startTransition(() => {})}
                title={assetCategories[category].label}
                className={cn(isActive && "bg-accent text-accent-foreground")}
              >
                {assetCategories[category].explanation}
              </ListItem>
            );
          })}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
