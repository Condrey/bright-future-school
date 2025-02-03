"use client";

import { toast } from "@/hooks/use-toast";
import {
  GeneralStoreItemData,
  IndividualGeneralStoreItemData,
} from "@/lib/types";
import { AssetCondition, BookStatus } from "@prisma/client";
import {
  MutationKey,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { addMultipleItem, addSingleItem, deleteIem } from "../action";

const mutationKey: MutationKey = ["addedGeneralStoreItem"];
const _key: QueryKey = ["assets", "general-store-asset", "list"];

export function useAddSingleItemMutation(
  generalStoreItem: GeneralStoreItemData,
) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "assets",
    "general-store-asset",
    "item",
    generalStoreItem.id,
    "list",
  ];
  const mutation = useMutation({
    mutationKey,
    mutationFn: addSingleItem,
    onMutate: async ({ input: addedItem }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<IndividualGeneralStoreItemData>(queryKey);

      queryClient.setQueryData<IndividualGeneralStoreItemData[]>(
        queryKey,
        (oldData) =>
          oldData && [
            {
              generalStoreItem: generalStoreItem,
              ...addedItem,
              assetDamages: [],
              _count: { assetDamages: 0 },
            } as IndividualGeneralStoreItemData,
            ...oldData,
          ],
      );

      return { previousState };
    },
    async onSuccess(_, variables) {
      const _key: QueryKey = ["assets", "generalStore-asset", "list"];
      await queryClient.cancelQueries({
        queryKey: _key,
      });
      queryClient.setQueryData<GeneralStoreItemData[]>(
        _key,
        (oldData) =>
          oldData &&
          oldData.map((d) =>
            d.id === variables.input.generalStoreItemId
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
        description: `Failed to add item to list of ${generalStoreItem.name} `,
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

export function useAddMultipleItemMutation(
  generalStoreItem: GeneralStoreItemData,
) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "assets",
    "generalStore-asset",
    "item",
    generalStoreItem.id,
    "list",
  ];
  const mutation = useMutation({
    mutationFn: addMultipleItem,
    onMutate: async ({ parentId, quantity }) => {
      const itemsToAdd = Array.from(
        { length: quantity },
        (_, index) =>
          ({
            generalStoreItem: generalStoreItem,
            assetDamages: [],
            _count: { assetDamages: 0 },
            id: `${parentId}==${index}`,
            generalStoreItemId: parentId,
            condition: AssetCondition.NEW,
            status: BookStatus.AVAILABLE,
            uniqueIdentifier: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }) as IndividualGeneralStoreItemData,
      );
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<IndividualGeneralStoreItemData>(queryKey);

      queryClient.setQueryData<IndividualGeneralStoreItemData[]>(
        queryKey,
        (oldData) => oldData && [...itemsToAdd, ...oldData],
      );
      return { previousState };
    },
    async onSuccess(_, variables) {
      await queryClient.cancelQueries({
        queryKey: _key,
      });
      queryClient.setQueryData<GeneralStoreItemData[]>(
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
        description: `Failed to add item to list of ${generalStoreItem.name}`,
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

export function useDeleteItemMutation(generalStoreItemId: string) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "assets",
    "generalStore-asset",
    "item",
    generalStoreItemId,
    "list",
  ];
  const mutation = useMutation({
    mutationFn: deleteIem,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<IndividualGeneralStoreItemData>(queryKey);

      queryClient.setQueryData<IndividualGeneralStoreItemData[]>(
        queryKey,
        (oldData) => oldData && oldData.filter((d) => d.id !== id),
      );
      return { previousState };
    },
    async onSuccess(_, variables) {
      await queryClient.cancelQueries({
        queryKey: _key,
      });
      queryClient.setQueryData<GeneralStoreItemData[]>(
        _key,
        (oldData) =>
          oldData &&
          oldData.map((d) =>
            d.id === variables.generalStoreItemId
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
