"use client";

import { toast } from "@/hooks/use-toast";
import { IndividualComputerLabItem } from "@prisma/client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIndividualItem } from "../../action";

export function useUpdateIndividualItem() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateIndividualItem,
    onSuccess: async (updateItem, variables) => {
      const queryKey: QueryKey = [
        "assets",
        "computer-lab-asset",
        "item",
        variables.id,
      ];
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<IndividualComputerLabItem>(
        queryKey,
        (oldData) => updateItem,
      );

      //   for list of individual items
      queryClient.invalidateQueries({
        queryKey: ["assets", "computer-lab-asset", "item"],
      });
      toast({
        description: `Successfully updated the item with unique identifier ${variables.uniqueIdentifier}`,
      });
    },
    onError(error, variables) {
      console.error(error);
      toast({
        description: `failed to update item with unique identifier ${variables.uniqueIdentifier}`,
      });
    },
  });
  return mutation;
}
