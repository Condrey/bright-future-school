"use client";

import { toast } from "@/hooks/use-toast";
import { IndividualLibraryBookData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIndividualItem } from "../../action";

export function useUpdateIndividualItem() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateIndividualItem,
    onSuccess: async (updateItem, variables) => {
      const queryKey: QueryKey = [
        "assets",
        "library-asset",
        "item",
        variables.id,
      ];
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<IndividualLibraryBookData>(
        queryKey,
        (oldData) => updateItem,
      );

      //   for list of individual items
      queryClient.invalidateQueries({
        queryKey: ["assets", "library-asset", "item"],
      });
      toast({
        description: `Successfully updated the item with isbn ${variables.isbn}`,
      });
    },
    onError(error, variables) {
      console.error(error);
      toast({
        description: `failed to update item with isbn ${variables.isbn}`,
      });
    },
  });
  return mutation;
}
