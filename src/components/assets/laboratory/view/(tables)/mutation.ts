"use client";

import { toast } from "@/hooks/use-toast";
import { IndividualLaboratoryItemData, LaboratoryItemData } from "@/lib/types";
import { AssetCondition, BookStatus } from "@prisma/client";
import {
  MutationKey,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { addMultipleItem, addSingleItem, deleteIem } from "../action";

const mutationKey: MutationKey = ["addedLaboratoryItem"];
const _key: QueryKey = ["assets", "laboratory-asset", "list"];

export function useAddSingleItemMutation(laboratoryItem: LaboratoryItemData) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "assets",
    "laboratory-asset",
    "item",
    laboratoryItem.id,
    "list",
  ];
  const mutation = useMutation({
    mutationKey,
    mutationFn: addSingleItem,
    onMutate: async ({ input: addedItem }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<IndividualLaboratoryItemData>(queryKey);

      queryClient.setQueryData<IndividualLaboratoryItemData[]>(
        queryKey,
        (oldData) =>
          oldData && [
            {
              labItem: laboratoryItem,
              ...addedItem,
              assetDamages: [],
              _count: { assetDamages: 0 },
            } as IndividualLaboratoryItemData,
            ...oldData,
          ],
      );

      return { previousState };
    },
    async onSuccess(_, variables) {
      const _key: QueryKey = ["assets", "laboratory-asset", "list"];
      await queryClient.cancelQueries({
        queryKey: _key,
      });
      queryClient.setQueryData<LaboratoryItemData[]>(
        _key,
        (oldData) =>
          oldData &&
          oldData.map((d) =>
            d.id === variables.input.labItemId
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
        description: `Failed to add item to list of ${laboratoryItem.name} `,
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

export function useAddMultipleItemMutation(laboratoryItem: LaboratoryItemData) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "assets",
    "laboratory-asset",
    "item",
    laboratoryItem.id,
    "list",
  ];
  const mutation = useMutation({
    mutationFn: addMultipleItem,
    onMutate: async ({ parentId, quantity }) => {
      const itemsToAdd = Array.from(
        { length: quantity },
        (_, index) =>
          ({
            labItem: laboratoryItem,
            assetDamages: [],
            _count: { assetDamages: 0 },
            id: `${parentId}==${index}`,
            labItemId: parentId,
            condition: AssetCondition.NEW,
            status: BookStatus.AVAILABLE,
            uniqueIdentifier: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }) as IndividualLaboratoryItemData,
      );
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<IndividualLaboratoryItemData>(queryKey);

      queryClient.setQueryData<IndividualLaboratoryItemData[]>(
        queryKey,
        (oldData) => oldData && [...itemsToAdd, ...oldData],
      );
      return { previousState };
    },
    async onSuccess(_, variables) {
      await queryClient.cancelQueries({
        queryKey: _key,
      });
      queryClient.setQueryData<LaboratoryItemData[]>(
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
        description: `Failed to add item to list of ${laboratoryItem.name}`,
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

export function useDeleteItemMutation(laboratoryItemId: string) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "assets",
    "laboratory-asset",
    "item",
    laboratoryItemId,
    "list",
  ];
  const mutation = useMutation({
    mutationFn: deleteIem,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<IndividualLaboratoryItemData>(queryKey);

      queryClient.setQueryData<IndividualLaboratoryItemData[]>(
        queryKey,
        (oldData) => oldData && oldData.filter((d) => d.id !== id),
      );
      return { previousState };
    },
    async onSuccess(_, variables) {
      await queryClient.cancelQueries({
        queryKey: _key,
      });
      queryClient.setQueryData<LaboratoryItemData[]>(
        _key,
        (oldData) =>
          oldData &&
          oldData.map((d) =>
            d.id === variables.laboratoryItemId
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
