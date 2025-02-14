"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllBookAuthors, getAuthorSBooks } from "./action";

export function useFetchAllLibBookAuthorsQuery(
  initialData: { author: string }[],
) {
  const query = useQuery({
    queryKey: ["library-book-author", "list"],
    queryFn: getAllBookAuthors,
    initialData,
  });
  return query;
}

export function useFetchAllAuthorLibBooksQuery(author: string) {
  const query = useQuery({
    queryKey: ["author", author, "books", "list"],
    queryFn: async () => getAuthorSBooks({ author }),
    staleTime: Infinity,
  });
  return query;
}
