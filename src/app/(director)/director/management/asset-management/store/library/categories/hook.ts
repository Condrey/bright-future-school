"use client";

import { LibraryBookCategoryData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getAllBookCategories } from "./action";

export function useFetchAllLibBookCategoriesQuery(
  initialData: LibraryBookCategoryData[],
) {
  const query = useQuery({
    queryKey: ["library-book-category", "list"],
    queryFn: getAllBookCategories,
    initialData,
  });
  return query;
}
