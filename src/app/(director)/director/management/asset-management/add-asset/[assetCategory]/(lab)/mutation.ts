"use client";

import { toast } from "@/hooks/use-toast";
import { LabItemData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { createLaboratoryAssetItem } from "./action";

export function useLaboratoryMutation() {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["lab-assets", "list"];
  const mutation = useMutation({
    mutationFn: createLaboratoryAssetItem,
    onSuccess: async (addedItem, variables) => {
      await queryClient.cancelQueries({ queryKey });
      // lab asset list
      queryClient.setQueryData<LabItemData[]>(
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
        description: "Failed to create lab item, please try again",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
