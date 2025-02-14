"use client";

import { useSession } from "@/app/session-provider";
import { Badge } from "@/components/ui/badge";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@prisma/client";
import { BookIcon, Loader2Icon } from "lucide-react";
import { useTransition } from "react";

interface BookContainerProps {
  book: {
    title: string;
    author: string;
    id: string;
  };
}

export default function BookContainer({ book }: BookContainerProps) {
  const { user } = useSession();
  if (!user) throw Error("Not authorized");
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();

  const privileges = myPrivileges[user.role];
  let pathname = "";
  if (privileges.includes(Role.DIRECTOR)) {
    pathname = "/director/management/asset-management/store/library/view/";
  }
  return (
    <Badge
      variant={"outline"}
      className="flex max-w-fit gap-1 p-2 hover:cursor-pointer hover:bg-secondary"
      onClick={() =>
        startTransition(() =>
          navigateOnclickWithPathnameWithoutUpdate(pathname + book.id),
        )
      }
    >
      {isPending ? (
        <Loader2Icon className="size-12 animate-spin" strokeWidth={0.5} />
      ) : (
        <BookIcon className="size-12 fill-secondary" strokeWidth={0.5} />
      )}
      <div>
        <div>{book.title}</div>{" "}
        <div className="text-xs text-muted-foreground">
          <span className="italic">by </span>
          {book.author}
        </div>
      </div>
    </Badge>
  );
}
