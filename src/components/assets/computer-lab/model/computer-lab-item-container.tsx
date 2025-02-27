"use client";

import { useSession } from "@/app/session-provider";
import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import TooltipContainer from "@/components/tooltip-container";
import { Badge } from "@/components/ui/badge";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@prisma/client";
import { ComputerIcon, Loader2Icon } from "lucide-react";
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

  const privileges = myPrivileges[user.role];
  let pathname = "";
  if (privileges.includes(Role.DIRECTOR)) {
    pathname = "/director/management/asset-management/store/computer_lab/view/";
  }
  return (
    <Badge
      variant={"outline"}
      className="flex max-w-fit gap-1 p-2 hover:cursor-pointer hover:bg-secondary"
      onClick={() =>
        startTransition(() =>
          navigateOnclickWithPathnameWithoutUpdate(
            pathname + computerLabItem.id,
          ),
        )
      }
    >
      {isPending ? (
        <Loader2Icon className="size-12 animate-spin" strokeWidth={0.5} />
      ) : (
        <ComputerIcon className="size-12 fill-secondary" strokeWidth={0.5} />
      )}
      <div>
        <div>{computerLabItem.name}</div>{" "}
        <div className="text-xs font-normal text-muted-foreground">
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
