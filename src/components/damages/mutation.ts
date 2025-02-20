"use client";

import { toast } from "@/hooks/use-toast";
import { AssetCategory } from "@prisma/client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addDamage,
  deleteDamage,
  repairUnrepairDamage,
  updateDamage,
  upsertAssetRepairPayment,
} from "./action";

const categories = (assetCategory: AssetCategory) => {
  const values: Record<AssetCategory, string> = {
    LIBRARY: "library-asset",
    COMPUTER_LAB: "computer-lab-asset",
    LABORATORY: "laboratory-asset",
    GENERAL_STORE: "general-store-asset",
    FOOD_STORE: "food-store-asset",
  };
  return values[assetCategory];
};

export function useUpsertAssetRepairPayment(assetCategory: AssetCategory) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: upsertAssetRepairPayment,
    onSuccess: async () => {
      const queryKey: QueryKey = ["assets", categories(assetCategory), "item"];
      const _key: QueryKey = ["vandalism", assetCategory];
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: _key });
      toast({ description: "successfully registered the payment." });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "failed to record this payment.",
        variant: "destructive",
      });
    },
  });
  return mutation;
}

export function useAddItemDamage(assetCategory: AssetCategory) {
  const queryKey: QueryKey = ["assets", categories(assetCategory), "item"];
  const _key: QueryKey = ["vandalism", assetCategory];

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addDamage,
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: _key });
      toast({ description: "successfully registered the damage." });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "failed to record this damage.",
        variant: "destructive",
      });
    },
  });
  return mutation;
}

export function useUpdateItemDamage(assetCategory: AssetCategory) {
  const queryKey: QueryKey = ["assets", categories(assetCategory), "item"];
  const _key: QueryKey = ["vandalism", assetCategory];

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateDamage,
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: _key });
      toast({ description: "successfully updated the damage." });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "failed to update this damage.",
        variant: "destructive",
      });
    },
  });
  return mutation;
}

export function useRepairUnrepairItemDamage(assetCategory: AssetCategory) {
  const queryKey: QueryKey = ["assets", categories(assetCategory), "item"];
  const _key: QueryKey = ["vandalism", assetCategory];

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: repairUnrepairDamage,
    onSuccess: async (_, variables) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: _key });
      toast({
        description: `successfully ${variables.input.isRepaired ? "repaired" : "undone repair to"} the damage.`,
      });
    },
    onError(error, variables) {
      console.error(error);
      toast({
        description: `failed to ${variables.input.isRepaired ? "register repair" : "undo repair register to"} this damage.`,
        variant: "destructive",
      });
    },
  });
  return mutation;
}

export function useDeleteItemDamageMutation(assetCategory: AssetCategory) {
  const queryKey: QueryKey = ["assets", categories(assetCategory), "item"];
  const _key: QueryKey = ["vandalism", assetCategory];

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteDamage,
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: _key });
      toast({ description: "successfully deleted the damage." });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "failed to delete this damage.",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
