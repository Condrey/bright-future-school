import VandalismNavItem from "@/components/navigation-bar/vandalism-nav-item";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { AssetCategory } from "@prisma/client";
import { HammerIcon, Package2Icon } from "lucide-react";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <VandalismNavItem />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
