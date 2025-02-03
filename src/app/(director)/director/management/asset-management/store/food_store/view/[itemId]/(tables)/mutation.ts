"use client";

import { toast } from "@/hooks/use-toast";
import { FoodStoreItemData, IndividualFoodStoreItemData } from "@/lib/types";
import { AssetCondition, BookStatus } from "@prisma/client";
import {
  MutationKey,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { addMultipleItem, addSingleItem, deleteIem } from "../action";

const mutationKey: MutationKey = ["addedFoodStoreItem"];
const _key: QueryKey = ["assets", "food-store-asset", "list"];

export function useAddSingleItemMutation(foodStoreItem: FoodStoreItemData) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "assets",
    "food-store-asset",
    "item",
    foodStoreItem.id,
    "list",
  ];
  const mutation = useMutation({
    mutationKey,
    mutationFn: addSingleItem,
    onMutate: async ({ input: addedItem }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<IndividualFoodStoreItemData>(queryKey);

      queryClient.setQueryData<IndividualFoodStoreItemData[]>(
        queryKey,
        (oldData) =>
          oldData && [
            {
              foodStoreItem: foodStoreItem,
              ...addedItem,
              assetDamages: [],
              _count: { assetDamages: 0 },
            } as IndividualFoodStoreItemData,
            ...oldData,
          ],
      );

      return { previousState };
    },
    async onSuccess(_, variables) {
      const _key: QueryKey = ["assets", "foodStore-asset", "list"];
      await queryClient.cancelQueries({
        queryKey: _key,
      });
      queryClient.setQueryData<FoodStoreItemData[]>(
        _key,
        (oldData) =>
          oldData &&
          oldData.map((d) =>
            d.id === variables.input.foodStoreItemId
              ? { ...d, quantity: d.quantity || 0 + 1 }
              : d,
          ),
      );
      queryClient.invalidateQueries({ queryKey: _key });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        description: `Failed to add item to list of ${foodStoreItem.foodName} `,
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
  const queryKey: QueryKey = [
    "assets",
    "foodStore-asset",
    "item",
    foodStoreItem.id,
    "list",
  ];
  const mutation = useMutation({
    mutationFn: addMultipleItem,
    onMutate: async ({ parentId, quantity }) => {
      const itemsToAdd = Array.from(
        { length: quantity },
        (_, index) =>
          ({
            foodStoreItem: foodStoreItem,
            assetDamages: [],
            _count: { assetDamages: 0 },
            id: `${parentId}==${index}`,
            foodStoreItemId: parentId,
            condition: AssetCondition.NEW,
            status: BookStatus.AVAILABLE,
            uniqueIdentifier: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }) as IndividualFoodStoreItemData,
      );
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<IndividualFoodStoreItemData>(queryKey);

      queryClient.setQueryData<IndividualFoodStoreItemData[]>(
        queryKey,
        (oldData) => oldData && [...itemsToAdd, ...oldData],
      );
      return { previousState };
    },
    async onSuccess(_, variables) {
      await queryClient.cancelQueries({
        queryKey: _key,
      });
      queryClient.setQueryData<FoodStoreItemData[]>(
        _key,
        (oldData) =>
          oldData &&
          oldData.map((d) =>
            d.id === variables.parentId
              ? { ...d, quantity: d.quantity || 0 + variables.quantity }
              : d,
          ),
      );
      queryClient.invalidateQueries({ queryKey: _key });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        description: `Failed to add item to list of ${foodStoreItem.foodName}`,
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

export function useDeleteItemMutation(foodStoreItemId: string) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "assets",
    "foodStore-asset",
    "item",
    foodStoreItemId,
    "list",
  ];
  const mutation = useMutation({
    mutationFn: deleteIem,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<IndividualFoodStoreItemData>(queryKey);

      queryClient.setQueryData<IndividualFoodStoreItemData[]>(
        queryKey,
        (oldData) => oldData && oldData.filter((d) => d.id !== id),
      );
      return { previousState };
    },
    async onSuccess(_, variables) {
      await queryClient.cancelQueries({
        queryKey: _key,
      });
      queryClient.setQueryData<FoodStoreItemData[]>(
        _key,
        (oldData) =>
          oldData &&
          oldData.map((d) =>
            d.id === variables.foodStoreItemId
              ? { ...d, quantity: d.quantity || 0 - 1 }
              : d,
          ),
      );
      queryClient.invalidateQueries({ queryKey: _key });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        description: `Failed to delete this item. `,
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
