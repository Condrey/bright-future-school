"use client";

import LoadingButton from "@/components/loading-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PARAM_NAME_LIB_BOOK_AUTHOR } from "@/lib/constants";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import BookContainer from "../categories/book-container";
import { useFetchAllAuthorLibBooksQuery } from "./hook";

export default function AuthorBooks() {
  const searchParams = useSearchParams();
  const searchParamsAuthor = searchParams.get(PARAM_NAME_LIB_BOOK_AUTHOR);
  const author = decodeURIComponent(searchParamsAuthor!);

  const { data, status, isFetching, error, refetch } =
    useFetchAllAuthorLibBooksQuery(author);
  if (!searchParamsAuthor) {
    return (
      <div className="flex min-h-[28rem] w-full flex-col items-center justify-center">
        <p className="max-w-sm text-center text-muted-foreground">
          Please choose an author from the side bar to display their books here.
        </p>
      </div>
    );
  }
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex size-full min-h-[28rem] flex-col items-center justify-center">
        <p className="max-w-sm text-center text-muted-foreground">
          Failed to fetch book categories. Please try again!
        </p>
        <LoadingButton
          loading={isFetching}
          onClick={() => refetch()}
          className="max-w-fit"
        >
          Refresh
        </LoadingButton>
      </div>
    );
  }
  if (status === "pending") {
    return (
      <div className="flex size-full min-h-[28rem] flex-col items-center justify-center">
        <p className="max-w-sm text-center text-muted-foreground">
          Fetching books
        </p>
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex size-full min-h-[28rem] flex-col items-center justify-center">
        <p className="max-w-sm text-center text-muted-foreground">
          There are no library book categories added in the database yet. Please
          add
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[28rem] w-full flex-col items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{author}</CardTitle>
          <CardDescription>
            {data.length === 0 ? (
              <span>There are no books belonging to this author</span>
            ) : (
              <span>{`Containing ${data.length} library book${data.length === 1 ? "" : "s"}`}</span>
            )}
          </CardDescription>
        </CardHeader>
        {data.length > 0 && (
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {data.map((book) => (
                <BookContainer key={book.id} book={book} />
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
