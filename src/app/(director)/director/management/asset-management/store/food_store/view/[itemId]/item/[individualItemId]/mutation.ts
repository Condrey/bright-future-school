"use client";

import { toast } from "@/hooks/use-toast";
import { IndividualFoodStoreItemData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIndividualItem } from "../../action";

export function useUpdateIndividualItem() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateIndividualItem,
    onSuccess: async (updateItem, variables) => {
      const queryKey: QueryKey = [
        "assets",
        "food-store-asset",
        "item",
        variables.id,
      ];
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<IndividualFoodStoreItemData>(
        queryKey,
        (oldData) => updateItem,
      );

      //   for list of individual items
      queryClient.invalidateQueries({
        queryKey: ["assets", "food-store-asset", "item"],
      });
      toast({
        description: `Successfully updated the item with unique Identifier ${variables.uniqueIdentifier}`,
      });
    },
    onError(error, variables) {
      console.error(error);
      toast({
        description: `failed to update item with unique Identifier ${variables.uniqueIdentifier}`,
      });
    },
  });
  return mutation;
}
