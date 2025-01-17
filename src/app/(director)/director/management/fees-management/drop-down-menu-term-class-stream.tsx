import { useSession } from "@/app/session-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TermWithYearData } from "@/lib/types";
import { Role } from "@prisma/client";
import { CopyIcon, MoreHorizontal } from "lucide-react";

interface DropDownMenuTermClassStreamProps {
  termClassStream: TermWithYearData;
}

export default function DropDownMenuTermClassStream({
  termClassStream,
}: DropDownMenuTermClassStreamProps) {
  const { user } = useSession();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(termClassStream.id)}
          >
            <CopyIcon className="mr-2 size-4" />
            <span>Copy class Id</span>
          </DropdownMenuItem>

          {user.role === Role.SUPER_ADMIN && (
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(termClassStream))
              }
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy class</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
