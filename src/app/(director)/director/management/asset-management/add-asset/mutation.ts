"use client";

import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAsset, updateAsset } from "./action";

export function useAddAssetMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addAsset,
    onSuccess: async (addedAsset) => {
      // TODO: implement success callbackify.
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to create asset, please try again",
        variant: "destructive",
      });
    },
  });
  return mutation;
}

export function useUpdateAssetMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateAsset,
    onSuccess: async (addedAsset) => {
      // TODO: implement success callbackify.
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to update asset, please try again",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
