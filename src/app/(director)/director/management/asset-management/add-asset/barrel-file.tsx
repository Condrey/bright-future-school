import {
  AssetCategory,
  AssetCondition,
  AssetItemStatus,
  AssetUnit,
  BookStatus,
} from "@prisma/client";
import {
  ComputerIcon,
  ForkKnifeIcon,
  LibraryIcon,
  LucideIcon,
  StoreIcon,
  TestTubeIcon,
} from "lucide-react";
export { NumberInput } from "@/components/number-input/number-input";
export { Button } from "@/components/ui/button";
export { Checkbox } from "@/components/ui/checkbox";
export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export { Textarea } from "@/components/ui/textarea";
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
  LITER: "Liter",
  PIECE: "Piece",
  GRAMS: "Gram",
  PACKETS: "Packet",
  PAIR: "Pair",
  JERRICAN: "Jerrican",
  CONTAINER: "Container",
  OTHERS: "Other",
};
//pairs,packets

export const assetItemStatuses: Record<AssetItemStatus, string> = {
  AVAILABLE: "Available",
  IN_USE: "In use",
  EXPIRED: "Expired ",
};

export const assetConditions: Record<AssetCondition, string> = {
  NEW: "Brand new",
  GOOD: "Good quality",
  FAIR: "Fairly good",
  POOR: "Poor quality",
  DAMAGED: "Damaged item",
};

export const bookStatuses: Record<BookStatus, string> = {
  AVAILABLE: "Is available",
  DAMAGED: "Is damaged",
  BORROWED: "Is borrowed",
};

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
