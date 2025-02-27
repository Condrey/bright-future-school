"use client";

import { useSession } from "@/app/session-provider";
import { Badge } from "@/components/ui/badge";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { BookIcon, Loader2Icon } from "lucide-react";
import { usePathname } from "next/navigation";
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

  const pathname = usePathname();
  let url = "/general-asset-manager/library-asset-management/view/";
  if (pathname.startsWith("/director/management/")) {
    url = "/director/management/asset-management/store/library/view/";
  } else if (pathname.startsWith("/library-asset-manager/")) {
    url = "/library-asset-manager/view/";
  }
  return (
    <Badge
      variant={"outline"}
      className="flex max-w-fit gap-1 p-2 hover:cursor-pointer hover:bg-secondary"
      onClick={() =>
        startTransition(() =>
          navigateOnclickWithPathnameWithoutUpdate(url + book.id),
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
