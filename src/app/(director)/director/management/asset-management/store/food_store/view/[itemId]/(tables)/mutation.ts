"use client";

import { toast } from "@/hooks/use-toast";
import { FoodStoreItemData, IndividualFoodStoreItemData } from "@/lib/types";
import {
  MutationKey,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addMultipleItem,
  addSingleItem,
  consumeFoodStoreItem,
  undoFoodStoreItemConsumption,
} from "../action";

const mutationKey: MutationKey = ["addedFoodStoreItem"];
const _key: QueryKey = ["assets", "food-store-asset", "list"];

export function useAddSingleItemMutation(foodStoreItem: FoodStoreItemData) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["assets", "food-store-item", foodStoreItem.id];
  const mutation = useMutation({
    mutationKey,
    mutationFn: addSingleItem,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<FoodStoreItemData>(queryKey);

      queryClient.setQueryData<FoodStoreItemData>(
        queryKey,
        (oldData) =>
          oldData && { ...oldData, quantity: (oldData.quantity || 0) + 1 },
      );

      return { previousState };
    },
    async onSuccess(_, variables) {
      queryClient.invalidateQueries({ queryKey: _key });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        description: `Failed to add item quantity `,
        variant: "destructive",
      });
    },
    onSettled() {
      if (queryClient.isMutating({ mutationKey }) === 1) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
  return mutation;
}

export function useAddMultipleItemMutation(foodStoreItem: FoodStoreItemData) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["assets", "food-store-item", foodStoreItem.id];
  const mutation = useMutation({
    mutationFn: addMultipleItem,
    onMutate: async ({ parentId, quantity }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<FoodStoreItemData>(queryKey);

      queryClient.setQueryData<FoodStoreItemData>(
        queryKey,
        (oldData) =>
          oldData && {
            ...oldData,
            quantity: (oldData.quantity || 0) + quantity,
          },
      );
      return { previousState };
    },
    async onSuccess(_, variables) {
      await queryClient.cancelQueries({
        queryKey: _key,
      });

      queryClient.invalidateQueries({ queryKey: _key });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        description: `Failed to add item quantity}`,
        variant: "destructive",
      });
    },
    onSettled() {
      if (queryClient.isMutating({ mutationKey }) === 1) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
  return mutation;
}
export function useConsumeFoodStoreItemMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: consumeFoodStoreItem,
    onMutate: async ({ foodStoreItemId, quantityUsed }) => {
      const queryKey: QueryKey = ["assets", "food-store-item", foodStoreItemId];
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<FoodStoreItemData>(queryKey);

      queryClient.setQueryData<FoodStoreItemData>(
        queryKey,
        (oldData) =>
          oldData && {
            ...oldData,
            quantity: (oldData.quantity || 0) - quantityUsed,
          },
      );
      return { previousState };
    },
    async onSuccess(_, variables) {
      const queryKey: QueryKey = [
        "assets",
        "food-store-item",
        variables.foodStoreItemId,
      ];

      await queryClient.cancelQueries({
        queryKey: _key,
      });

      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: _key });
    },
    onError: (error, variables, context) => {
      const queryKey: QueryKey = [
        "assets",
        "food-store-item",
        variables.foodStoreItemId,
      ];

      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        description: `Failed to add item to list of consumptions`,
        variant: "destructive",
      });
    },
    onSettled(data, error, variables) {
      const queryKey: QueryKey = [
        "assets",
        "food-store-item",
        variables.foodStoreItemId,
      ];
      if (queryClient.isMutating({ mutationKey }) === 1) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
  return mutation;
}

export function useUndoFoodStoreItemConsumptionMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: undoFoodStoreItemConsumption,
    onMutate: async ({ foodStoreItemId, quantityUsed }) => {
      const queryKey: QueryKey = ["assets", "food-store-item", foodStoreItemId];
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<FoodStoreItemData>(queryKey);

      queryClient.setQueryData<FoodStoreItemData>(
        queryKey,
        (oldData) =>
          oldData && {
            ...oldData,
            quantity: (oldData.quantity || 0) + quantityUsed,
          },
      );
      return { previousState };
    },
    async onSuccess(_, variables) {
      const queryKey: QueryKey = [
        "assets",
        "food-store-item",
        variables.foodStoreItemId,
      ];

      await queryClient.cancelQueries({
        queryKey: _key,
      });

      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: _key });
    },
    onError: (error, variables, context) => {
      const queryKey: QueryKey = [
        "assets",
        "food-store-item",
        variables.foodStoreItemId,
      ];

      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        description: `Failed to add item to list of consumptions`,
        variant: "destructive",
      });
    },
    onSettled(data, error, variables) {
      const queryKey: QueryKey = [
        "assets",
        "food-store-item",
        variables.foodStoreItemId,
      ];
      if (queryClient.isMutating({ mutationKey }) === 1) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
  return mutation;
}
