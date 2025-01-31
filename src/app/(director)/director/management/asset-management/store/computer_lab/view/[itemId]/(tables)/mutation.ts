"use client";

import { toast } from "@/hooks/use-toast";
import { IndividualComputerLabItemData } from "@/lib/types";
import {
  AssetCondition,
  AssetItemStatus,
  ComputerLabItem,
} from "@prisma/client";
import {
  MutationKey,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { addMultipleItem, addSingleItem } from "../action";

const mutationKey: MutationKey = ["addedComputerLabItem"];

export function useAddSingleItemMutation(computerLabItem: ComputerLabItem) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "assets",
    "computer-lab-asset",
    "item",
    computerLabItem.id,
    "list",
  ];
  const mutation = useMutation({
    mutationKey,
    mutationFn: addSingleItem,
    onMutate: async ({ input: addedItem }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<IndividualComputerLabItemData>(queryKey);

      queryClient.setQueryData<IndividualComputerLabItemData[]>(
        queryKey,
        (oldData) =>
          oldData && [
            {
              computerLabItem,
              ...addedItem,
            } as IndividualComputerLabItemData,
            ...oldData,
          ],
      );
      return { previousState };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        description: `Failed to add item to list of ${computerLabItem.model} ${computerLabItem.name}s `,
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

export function useAddMultipleItemMutation(computerLabItem: ComputerLabItem) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "assets",
    "computer-lab-asset",
    "item",
    computerLabItem.id,
    "list",
  ];
  const mutation = useMutation({
    mutationFn: addMultipleItem,
    onMutate: async ({ parentId, quantity }) => {
      const itemsToAdd = Array.from(
        { length: quantity },
        (_, index) =>
          ({
            computerLabItem,
            id: `${parentId}==${index}`,
            computerLabItemId: parentId,
            condition: AssetCondition.NEW,
            status: AssetItemStatus.AVAILABLE,
            uniqueIdentifier: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }) as IndividualComputerLabItemData,
      );
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<IndividualComputerLabItemData>(queryKey);

      queryClient.setQueryData<IndividualComputerLabItemData[]>(
        queryKey,
        (oldData) => oldData && [...itemsToAdd, ...oldData],
      );
      return { previousState };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        description: `Failed to add item to list of ${computerLabItem.model} ${computerLabItem.name}s `,
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
