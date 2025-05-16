"use client";

import { useSession } from "@/app/session-provider";
import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import TooltipContainer from "@/components/tooltip-container";
import { Badge } from "@/components/ui/badge";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@prisma/client";
import { ComputerIcon, Loader2Icon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

interface ComputerLabItemContainerProps {
  computerLabItem: {
    model: string;
    name: string;
    specification: string;
    id: string;
  };
}

export default function ComputerLabItemContainer({
  computerLabItem,
}: ComputerLabItemContainerProps) {
  const { user } = useSession();
  if (!user) throw Error("Not authorized");
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();

  let url = "/general-asset-manager/computer-lab-asset-management/view/";
  if (pathname.startsWith("/director/management")) {
    url = "/director/management/asset-management/store/computer_lab/view/";
  } else if (pathname.startsWith("/computer-lab-asset-manager")) {
    url = "/computer-lab-asset-manager/view/";
  }
  return (
    <Badge
      variant={"outline"}
      className="hover:bg-secondary flex max-w-fit gap-1 p-2 hover:cursor-pointer"
      onClick={() =>
        startTransition(() =>
          navigateOnclickWithPathnameWithoutUpdate(url + computerLabItem.id),
        )
      }
    >
      {isPending ? (
        <Loader2Icon className="size-12 animate-spin" strokeWidth={0.5} />
      ) : (
        <ComputerIcon className="fill-secondary size-12" strokeWidth={0.5} />
      )}
      <div>
        <div>{computerLabItem.name}</div>{" "}
        <div className="text-muted-foreground text-xs font-normal">
          <span className="italic">model </span>
          {computerLabItem.model}
        </div>
        <div>
          <TooltipContainer label="View specification">
            <TipTapViewer content={computerLabItem.specification} />
          </TooltipContainer>
        </div>
      </div>
    </Badge>
  );
}
