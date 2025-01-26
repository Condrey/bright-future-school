"use client";

import { toast } from "@/hooks/use-toast";
import { ComputerLabItemData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { createComputerLabAssetItem } from "./action";

export function useComputerLabMutation() {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["computer-lab-assets", "list"];
  const mutation = useMutation({
    mutationFn: createComputerLabAssetItem,
    onSuccess: async (addedItem, variables) => {
      await queryClient.cancelQueries({ queryKey });
      // computer lab asset list
      queryClient.setQueryData<ComputerLabItemData[]>(
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
        description: "Failed to create computer lab item, please try again",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
