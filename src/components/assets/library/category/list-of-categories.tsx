"use client";

import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { PARAM_NAME_LIB_BOOK_CATEGORY_ID } from "@/lib/constants";
import { LibraryBookCategoryData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LibraryBookCategory } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useFetchAllLibBookCategoriesQuery } from "./hook";

interface ListOfCategoriesProps {
  oldData: LibraryBookCategoryData[];
}
export default function ListOfCategories({ oldData }: ListOfCategoriesProps) {
  const { data, status, isFetching, error, refetch } =
    useFetchAllLibBookCategoriesQuery(oldData);
  if (status === "error") {
    console.error(error);
  }

  return (
    <div className="bg-card h-fit w-[24rem] space-y-3 rounded-md p-3">
      <h1 className="text-xl">Book categories</h1>
      <div>
        {status === "error" ? (
          <div className="flex size-full min-h-[28rem] flex-col items-center justify-center">
            <p className="text-muted-foreground max-w-sm text-center">
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
        ) : status === "success" && !data.length ? (
          <div className="flex size-full min-h-[28rem] flex-col items-center justify-center">
            <p className="text-muted-foreground max-w-sm text-center">
              There are no library book categories added in the database yet.
              Please add
            </p>
            <Button>Add new category</Button>
          </div>
        ) : (
          <div className="size-full h-fit max-h-[75vh] space-y-1.5 overflow-y-auto scroll-smooth">
            {data.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CategoryItemProps {
  category: LibraryBookCategory;
}

function CategoryItem({ category }: CategoryItemProps) {
  const [isPending, startTransition] = useTransition();
  const { updateSearchParamsAndNavigate } = useCustomSearchParams();
  const searchParams = useSearchParams();
  const categoryInView = searchParams.get(PARAM_NAME_LIB_BOOK_CATEGORY_ID);
  return (
    <LoadingButton
      variant={categoryInView === category.id ? "secondary" : "ghost"}
      loading={isPending}
      onClick={() =>
        startTransition(() => {
          updateSearchParamsAndNavigate(
            PARAM_NAME_LIB_BOOK_CATEGORY_ID,
            category.id,
          );
        })
      }
      className={cn("w-full justify-start")}
    >
      {category.category}
    </LoadingButton>
  );
}
