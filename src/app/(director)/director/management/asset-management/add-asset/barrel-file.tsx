import { AssetCategory, AssetUnit, LabItemStatus } from "@prisma/client";
import {
  ComputerIcon,
  ForkKnifeIcon,
  LibraryIcon,
  LucideIcon,
  StoreIcon,
  TestTubeIcon,
} from "lucide-react";
export { NumberInput } from "@/components/number-input/number-input";
export { Checkbox } from "@/components/ui/checkbox";
export { SelectGroup, SelectLabel } from "@/components/ui/select";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
export { Input } from "@/components/ui/input";
export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export const assetCategories: Record<
  AssetCategory,
  { label: string; icon: LucideIcon }
> = {
  LIBRARY: { label: "Library item", icon: LibraryIcon },
  COMPUTER_LAB: { label: "Computer lab item", icon: ComputerIcon },
  LABORATORY: { label: "Laboratory item", icon: TestTubeIcon },
  GENERAL_STORE: { label: "General store item", icon: StoreIcon },
  FOOD_STORE: { label: "Food store item", icon: ForkKnifeIcon },
};

export const assetUnits: Record<AssetUnit, string> = {
  KILOGRAM: "Kilogram",
  SAC: "Sac",
  LITERS: "Liter",
  PIECES: "Piece",
};
//pairs,packets

export const labItemStatuses: Record<LabItemStatus, string> = {
  AVAILABLE: "Available",
  IN_USE: "In use",
  EXPIRED: "Expired ",
};
