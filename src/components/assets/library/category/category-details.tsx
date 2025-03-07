"use client";

import LoadingButton from "@/components/loading-button";
import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PARAM_NAME_LIB_BOOK_CATEGORY_ID } from "@/lib/constants";
import { LibraryBookCategoryData } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import BookContainer from "./book-container";
import { useFetchAllLibBookCategoriesQuery } from "./hook";

interface CategoryDetailsProps {
  oldData: LibraryBookCategoryData[];
}
export default function CategoryDetails({ oldData }: CategoryDetailsProps) {
  const searchParams = useSearchParams();
  const searchParamCategory = searchParams.get(PARAM_NAME_LIB_BOOK_CATEGORY_ID);

  const { data, status, isFetching, error, refetch } =
    useFetchAllLibBookCategoriesQuery(oldData);
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
  const category = data.find((d) => d.id === searchParamCategory);

  return (
    <div className="flex min-h-[28rem] w-full flex-col items-center">
      {!oldData.length ? (
        <div className="flex size-full min-h-[28rem] flex-col items-center justify-center">
          <p className="max-w-sm text-center text-muted-foreground">
            There are no library book categories added in the database yet.
            Please add
          </p>
          <Button>Add new category</Button>
        </div>
      ) : !category ? (
        <div className="flex size-full min-h-[28rem] flex-col items-center justify-center">
          <p className="max-w-sm text-center text-muted-foreground">
            Please choose a category from the side bar to display its details
            here.
          </p>
        </div>
      ) : (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{category.category}</CardTitle>
            <CardDescription>
              {category._count.libraryBooks === 0 ? (
                <span>There are no books registered under this category</span>
              ) : (
                <span>{`Containing ${category._count.libraryBooks} library book${category._count.libraryBooks === 1 ? "" : "s"}`}</span>
              )}
            </CardDescription>
          </CardHeader>
          {category._count.libraryBooks > 0 && (
            <CardContent className="space-y-3">
              <p>Sample books are </p>
              <div className="flex flex-wrap gap-2">
                {category.libraryBooks.slice(0, 10).map((book) => (
                  <BookContainer key={book.id} book={book} />
                ))}
              </div>
            </CardContent>
          )}
          <CardFooter className="max-w-prose">
            <TipTapViewer content={category.description} />
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
