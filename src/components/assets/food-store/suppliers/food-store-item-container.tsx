
"use client";

import { useSession } from "@/app/session-provider";
import { Badge } from "@/components/ui/badge";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@prisma/client";
import { ForkKnifeIcon, Loader2Icon } from "lucide-react";
import { useTransition } from "react";

interface FoodStoreItemContainerProps {
  foodStoreItem: {
    foodName: string;
    isConsumable: boolean;
    id: string;
  };
}

export default function FoodStoreItemContainer({ foodStoreItem }: FoodStoreItemContainerProps) {
  const { user } = useSession();
  if (!user) throw Error("Not authorized");
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();

  const privileges = myPrivileges[user.role];
  let pathname = "";
  if (privileges.includes(Role.DIRECTOR)) {
    pathname = "/director/management/asset-management/store/food_store/view/";
  }
  return (
    <Badge
      variant={"outline"}
      className="flex max-w-fit gap-1 p-2 hover:cursor-pointer hover:bg-secondary"
      onClick={() =>
        startTransition(() =>
          navigateOnclickWithPathnameWithoutUpdate(pathname + foodStoreItem.id),
        )
      }
    >
      {isPending ? (
        <Loader2Icon className="size-12 animate-spin" strokeWidth={0.5} />
      ) : (
        <ForkKnifeIcon className="size-12 fill-secondary" strokeWidth={0.5} />
      )}
      <div className="space-y-1.5">
        <div className="text-sm">{foodStoreItem.foodName}</div>{" "}
        <Badge variant={foodStoreItem.isConsumable?'go':'destructive'} className="text-xs" >
          {foodStoreItem.isConsumable?'Consumable':'Not Consumable'}
        </Badge>
      </div>
    </Badge>
  );
}
