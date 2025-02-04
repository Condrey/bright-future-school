"use client";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Package2Icon } from "lucide-react";
import Link from "next/link";
import { ListItem } from "./list-item";

export default function VandalismNavItem() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Asset management</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
          <li className="row-span-3">
            <NavigationMenuLink asChild>
              <Link
                href={`#`}
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
              >
                <Package2Icon className="size-6" />
                <div className="mb-2 mt-4 text-lg font-medium">All assets</div>
                <p className="text-sm leading-tight text-muted-foreground">
                  A one-stop-point for efficiently managing and analyzing all
                  school assets.
                </p>
              </Link>
            </NavigationMenuLink>
          </li>
          {Object.values(AssetCategory).map((category) => {
            return (
              <ListItem
                key={category}
                href={`#`}
                title={assetCategories[category].label}
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
