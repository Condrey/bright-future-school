"use client";

import { toast } from "@/hooks/use-toast";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { lendBook, retrieveBook } from "./action";

const queryKey: QueryKey = ["assets", "library-asset", "item"];
export function useLendBookMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: lendBook,
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      toast({ description: "Successfully recorded the action" });
    },
    onError(error) {
      console.error(error);
      toast({ description: "Failed to record action", variant: "destructive" });
    },
  });

  return mutation;
}

export function useRetrieveBookMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: retrieveBook,
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({
        queryKey: ["lib-books", "borrowing-list"],
      });
      toast({ description: "Successfully recorded book retrieval" });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to record book retrieval",
        variant: "destructive",
      });
    },
  });

  return mutation;
}
