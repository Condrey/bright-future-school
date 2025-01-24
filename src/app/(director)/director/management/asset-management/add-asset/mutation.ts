"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAsset, updateAsset } from "./action";

export function useAddAssetMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addAsset,
    onSuccess: async (addedAsset) => {
      // TODO: implement success callbackify.
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
  });
  return mutation;
}
