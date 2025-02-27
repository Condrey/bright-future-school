"use client";

import { toast } from "@/hooks/use-toast";
import { ComputerLabItemData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  createComputerLabAssetItem,
  updateComputerLabAssetItem,
} from "./action";

export function useAddComputerLabMutation() {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["computer-lab-assets", "list"];
  const mutation = useMutation({
    mutationFn: createComputerLabAssetItem,
    onSuccess: async (addedItem, variables) => {
      await queryClient.cancelQueries({ queryKey });
      // computer lab asset list
      queryClient.setQueryData<ComputerLabItemData[]>(
        queryKey,
        (oldData) => oldData && [addedItem, ...oldData],
      );
      toast({
        description: `Successfully added ${variables.name} to the list of assets.`,
      });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to create computer lab item, please try again",
        variant: "destructive",
      });
    },
  });
  return mutation;
}

export function useUpdateComputerLabMutation() {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["computer-lab-assets", "list"];
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: updateComputerLabAssetItem,
    onSuccess: async (updatedItem, variables) => {
      await queryClient.cancelQueries({ queryKey });
      // computer lab asset list
      queryClient.setQueryData<ComputerLabItemData[]>(
        queryKey,
        (oldData) =>
          oldData &&
          oldData.map((d) => (d.id === updatedItem.id ? updatedItem : d)),
      );
      // computer lab item list
      queryClient.setQueryData<ComputerLabItemData[]>(
        ["assets", "computer-lab-asset", "list"],
        (oldData) =>
          oldData &&
          oldData.map((d) => (d.id === updatedItem.id ? updatedItem : d)),
      );
      toast({
        description: `Successfully updated ${variables.name} in the list of assets.`,
      });
      router.back();
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to create computer lab item, please try again",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
