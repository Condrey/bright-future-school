"use client";

import { toast } from "@/hooks/use-toast";
import { GeneralStoreItemData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { createGeneralStoreAssetItem } from "./action";

export function useGeneralStoreMutation() {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["general-store-assets", "list"];
  const mutation = useMutation({
    mutationFn: createGeneralStoreAssetItem,
    onSuccess: async (addedItem, variables) => {
      await queryClient.cancelQueries({ queryKey });
      // general store asset list
      queryClient.setQueryData<GeneralStoreItemData[]>(
        queryKey,
        (oldData) => oldData && [addedItem, ...oldData],
      );
      toast({
        description: `Successfully added ${variables.name} to the list of assets.`,
      });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to create general store item, please try again",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
