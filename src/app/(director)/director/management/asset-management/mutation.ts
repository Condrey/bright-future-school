"use client";

import { toast } from "@/hooks/use-toast";
import { AssetData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { addAsset, deleteAsset, updateAsset } from "./action";

const queryKey: QueryKey = ["assets", "list"];

export function useAddAssetMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addAsset,
    onSuccess: async (addedAsset) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<AssetData[]>(
        queryKey,
        (old) => old && [addedAsset, ...old],
      );
      toast({
        description: "Asset added successfully",
      });
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
    onSuccess: async (updatedAsset) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<AssetData[]>(
        queryKey,
        (old) =>
          old &&
          old.map((asset) =>
            asset.id === updatedAsset.id ? updatedAsset : asset,
          ),
      );
      toast({
        description: "Asset updated successfully",
      });
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

export function useDeleteAssetMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteAsset,
    onSuccess: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<AssetData[]>(
        queryKey,
        (old) => old && old.filter((asset) => asset.id !== id),
      );
      toast({
        description: "Asset added successfully",
      });
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
