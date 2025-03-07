"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllFoodStoreSuppliers, getSupplierSFoodItems } from "./action";

export function useFetchAllFoodStoreSuppliersQuery(
  initialData: { name: string; contactInfo: string; id: string }[],
) {
  const query = useQuery({
    queryKey: ["food-store-item-supplier", "list"],
    queryFn: getAllFoodStoreSuppliers,
    initialData,
  });
  return query;
}

export function useFetchAllSupplierSFoodItemsQuery(id: string) {
  const query = useQuery({
    queryKey: ["supplier", id, "food-store-item", "list"],
    queryFn: async () => getSupplierSFoodItems({ supplierId: id }),
    staleTime: Infinity,
  });
  return query;
}
