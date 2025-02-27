"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllBrandModels, getBrandModelSItems } from "./action";

export function useFetchAllBrandModelsQuery(initialData: { model: string }[]) {
  const query = useQuery({
    queryKey: ["computer-item-brand-models", "list"],
    queryFn: getAllBrandModels,
    initialData,
  });
  return query;
}

export function useFetchBrandModelSItemsQuery(model: string) {
  const query = useQuery({
    queryKey: ["computer-lab-items", model, "items", "list"],
    queryFn: async () => getBrandModelSItems({ model }),
    staleTime: Infinity,
  });
  return query;
}
