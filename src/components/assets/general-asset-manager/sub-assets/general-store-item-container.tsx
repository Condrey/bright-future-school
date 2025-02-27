"use client";

import { useSession } from "@/app/session-provider";
import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import TooltipContainer from "@/components/tooltip-container";
import { Badge } from "@/components/ui/badge";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { Loader2Icon, StoreIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

interface GeneralStoreItemContainerProps {
  individualStoreItem: {
    name: string;
    description: string;
    asset: string;
    id: string;
  };
}

export default function GeneralStoreItemContainer({
  individualStoreItem,
}: GeneralStoreItemContainerProps) {
  const { user } = useSession();
  if (!user) throw Error("Not authorized");
  const pathname = usePathname();
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();

  let url = "/general-asset-manager/general-asset-management/view/";
  if (pathname.startsWith("/director/management")) {
    url = "/director/management/asset-management/store/general_store/view/";
  } else if (pathname.startsWith("/general-store-asset-manager")) {
    url = "/general-store-asset-manager/view/";
  }
  return (
    <Badge
      variant={"outline"}
      className="flex max-w-fit gap-1 p-2 hover:cursor-pointer hover:bg-secondary"
      onClick={() =>
        startTransition(() =>
          navigateOnclickWithPathnameWithoutUpdate(
            url + individualStoreItem.id,
          ),
        )
      }
    >
      {isPending ? (
        <Loader2Icon className="size-12 animate-spin" strokeWidth={0.5} />
      ) : (
        <StoreIcon className="size-12 fill-secondary" strokeWidth={0.5} />
      )}
      <div>
        <div>{individualStoreItem.name}</div>{" "}
        <div className="text-xs font-normal text-muted-foreground">
          <span className="italic">under </span>
          {individualStoreItem.asset}
        </div>
        <div>
          <TooltipContainer label="View description">
            <TipTapViewer content={individualStoreItem.description} />
          </TooltipContainer>
        </div>
      </div>
    </Badge>
  );
}
