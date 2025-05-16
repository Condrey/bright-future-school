"use client";

import LoadingButton from "@/components/loading-button";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";

import { PARAM_NAME_LIB_BOOK_AUTHOR } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useFetchAllLibBookAuthorsQuery } from "./hook";

interface ListOfAuthorsProps {
  oldData: { author: string }[];
}
export default function ListOfAuthors({ oldData }: ListOfAuthorsProps) {
  const { data, status, isFetching, error, refetch } =
    useFetchAllLibBookAuthorsQuery(oldData);
  if (status === "error") {
    console.error(error);
  }

  return (
    <div className="bg-card h-fit w-[24rem] space-y-3 rounded-md p-3">
      <h1 className="text-xl">Book authors</h1>
      <div>
        {status === "error" ? (
          <div className="flex min-h-[28rem] flex-col items-center justify-center">
            <p className="text-muted-foreground max-w-sm text-center">
              Failed to fetch book authors. Please try again!
            </p>
            <LoadingButton
              loading={isFetching}
              onClick={() => refetch()}
              className="max-w-fit"
            >
              Refresh
            </LoadingButton>
          </div>
        ) : status === "success" && !data.length ? (
          <div className="flex min-h-[28rem] flex-col items-center justify-center">
            <p className="text-muted-foreground max-w-sm text-center">
              There are no library book authors added in the database yet.
              Please add
            </p>
          </div>
        ) : (
          <div className="h-fit max-h-[75vh] space-y-1.5 overflow-y-auto scroll-smooth">
            {data.map(({ author }) => (
              <AuthorItem key={author} author={author} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface AuthorItemProps {
  author: string;
}

function AuthorItem({ author }: AuthorItemProps) {
  const [isPending, startTransition] = useTransition();
  const { updateSearchParamsAndNavigate } = useCustomSearchParams();
  const searchParams = useSearchParams();
  const authorInView = searchParams.get(PARAM_NAME_LIB_BOOK_AUTHOR);
  return (
    <LoadingButton
      variant={authorInView === author ? "secondary" : "ghost"}
      loading={isPending}
      onClick={() =>
        startTransition(() => {
          updateSearchParamsAndNavigate(PARAM_NAME_LIB_BOOK_AUTHOR, author);
        })
      }
      className={cn("w-full justify-start")}
    >
      {author}
    </LoadingButton>
  );
}
