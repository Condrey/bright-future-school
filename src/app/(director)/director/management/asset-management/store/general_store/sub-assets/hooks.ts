"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllSubAssets, getSubAssetItems } from "./action";

export function useFetchAllSubAssetsQuery(initialData: { name: string,id:string }[]) {
  const query = useQuery({
    queryKey: ["general-store-sub-asset", "list"],
    queryFn: getAllSubAssets,
    initialData,
  });
  return query;
}

export function useFetchSubAssetItemsQuery(assetId: string) {
  const query = useQuery({
    queryKey: ["general-store-sub-asset", assetId, "items", "list"],
    queryFn: async () => getSubAssetItems({ assetId }),
    staleTime: Infinity,
  });
  return query;
}
