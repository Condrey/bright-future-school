"use client";

import { toast } from "@/hooks/use-toast";
import { LibraryBookData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { createLibraryAssetItem } from "./action";

export function useLibraryMutation() {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["library-assets", "list"];
  const mutation = useMutation({
    mutationFn: createLibraryAssetItem,
    onSuccess: async (addedItem, variables) => {
      await queryClient.cancelQueries({ queryKey });
      // library asset list
      queryClient.setQueryData<LibraryBookData[]>(
        queryKey,
        (oldData) => oldData && [addedItem, ...oldData],
      );
      toast({
        description: `Successfully added ${variables.title} to the list of assets.`,
      });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to create library item, please try again",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
