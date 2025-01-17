"use client";

import { directorDashboardParamsQueryKey } from "@/app/(director)/hook";
import { toast } from "@/hooks/use-toast";
import { DirectorDashboardParam } from "@/lib/types";
import { Term } from "@prisma/client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { addTermAction, deleteTermAction, editTermAction } from "./action";

const queryKey: QueryKey = ["terms"];

export function useAddTermMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addTermAction,
    async onSuccess(addedTerm) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Term[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return [...oldData, addedTerm];
      });

      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) => oldData && { ...oldData, terms: oldData.terms + 1 },
      );

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to add term, please try again.!",
      });
    },
  });

  return mutation;
}

export function useUpdateTermMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editTermAction,
    async onSuccess(updatedTerm) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Term[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.map((d) => (d.id === updatedTerm.id ? updatedTerm : d));
      });

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update term, please try again.!",
      });
    },
  });

  return mutation;
}

export function useDeleteTermMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteTermAction,
    async onSuccess(id) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Term[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.filter((d) => d.id !== id);
      });

      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) => oldData && { ...oldData, terms: oldData.terms - 1 },
      );

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete term, please try again.!",
      });
    },
  });

  return mutation;
}
