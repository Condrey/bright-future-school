"use client";

import { toast } from "@/hooks/use-toast";
import { IndividualLibraryBookData, LibraryBookData } from "@/lib/types";
import { AssetCondition, BookStatus } from "@prisma/client";
import {
  MutationKey,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { addMultipleItem, addSingleItem, deleteIem } from "../action";

const mutationKey: MutationKey = ["addedLibraryItem"];
const _key: QueryKey = ["assets", "library-asset", "list"];

export function useAddSingleItemMutation(libraryItem: LibraryBookData) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "assets",
    "library-asset",
    "item",
    libraryItem.id,
    "list",
  ];
  const mutation = useMutation({
    mutationKey,
    mutationFn: addSingleItem,
    onMutate: async ({ input: addedItem }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<IndividualLibraryBookData>(queryKey);

      queryClient.setQueryData<IndividualLibraryBookData[]>(
        queryKey,
        (oldData) =>
          oldData && [
            {
              libraryBook: libraryItem,
              ...addedItem,
              bookDamages: [],
              _count: { bookDamages: 0, borrowers: 0 },
              borrowers: [],
            } as IndividualLibraryBookData,
            ...oldData,
          ],
      );

      return { previousState };
    },
    async onSuccess(_, variables) {
      const _key: QueryKey = ["assets", "library-asset", "list"];
      await queryClient.cancelQueries({
        queryKey: _key,
      });
      queryClient.setQueryData<LibraryBookData[]>(
        _key,
        (oldData) =>
          oldData &&
          oldData.map((d) =>
            d.id === variables.input.libraryBookId
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
        description: `Failed to add item to list of ${libraryItem.author} ${libraryItem.title}s `,
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

export function useAddMultipleItemMutation(libraryItem: LibraryBookData) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "assets",
    "library-asset",
    "item",
    libraryItem.id,
    "list",
  ];
  const mutation = useMutation({
    mutationFn: addMultipleItem,
    onMutate: async ({ parentId, quantity }) => {
      const itemsToAdd = Array.from(
        { length: quantity },
        (_, index) =>
          ({
            libraryBook: libraryItem,
            borrowCount: 0,
            bookDamages: [],
            borrowers: [],
            _count: { bookDamages: 0, borrowers: 0 },
            id: `${parentId}==${index}`,
            libraryBookId: parentId,
            condition: AssetCondition.NEW,
            status: BookStatus.AVAILABLE,
            isbn: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }) as IndividualLibraryBookData,
      );
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<IndividualLibraryBookData>(queryKey);

      queryClient.setQueryData<IndividualLibraryBookData[]>(
        queryKey,
        (oldData) => oldData && [...itemsToAdd, ...oldData],
      );
      return { previousState };
    },
    async onSuccess(_, variables) {
      await queryClient.cancelQueries({
        queryKey: _key,
      });
      queryClient.setQueryData<LibraryBookData[]>(
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
        description: `Failed to add item to list of ${libraryItem.author} ${libraryItem.title}s `,
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

export function useDeleteItemMutation(libraryItemId: string) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "assets",
    "library-asset",
    "item",
    libraryItemId,
    "list",
  ];
  const mutation = useMutation({
    mutationFn: deleteIem,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<IndividualLibraryBookData>(queryKey);

      queryClient.setQueryData<IndividualLibraryBookData[]>(
        queryKey,
        (oldData) => oldData && oldData.filter((d) => d.id !== id),
      );
      return { previousState };
    },
    async onSuccess(_, variables) {
      await queryClient.cancelQueries({
        queryKey: _key,
      });
      queryClient.setQueryData<LibraryBookData[]>(
        _key,
        (oldData) =>
          oldData &&
          oldData.map((d) =>
            d.id === variables.libraryItemId
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
