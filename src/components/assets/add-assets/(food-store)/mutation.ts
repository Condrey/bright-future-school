"use client";

import { toast } from "@/hooks/use-toast";
import { FoodStoreItemData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFoodStoreAssetItem } from "./action";

export function useFoodStoreMutation() {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["food-store-assets", "list"];
  const mutation = useMutation({
    mutationFn: createFoodStoreAssetItem,
    onSuccess: async (addedItem, variables) => {
      await queryClient.cancelQueries({ queryKey });
      // food store asset list
      queryClient.setQueryData<FoodStoreItemData[]>(
        queryKey,
        (oldData) => oldData && [addedItem, ...oldData],
      );
      toast({
        description: `Successfully added ${variables.foodName} to the list of assets.`,
      });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to create food store item, please try again",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
