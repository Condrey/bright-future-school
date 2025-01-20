"use client";

import {
  directorDashboardParamsQueryKey,
  termSwitcherQueryKey,
} from "@/app/(director)/hook";
import { toast } from "@/hooks/use-toast";
import kyInstance from "@/lib/ky";
import { DirectorDashboardParam } from "@/lib/types";
import { TermSchema } from "@/lib/validation";
import { Term } from "@prisma/client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

const queryKey: QueryKey = ["terms"];

export function useAddTermMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: TermSchema) =>
      kyInstance
        .post("/api/terms", {
          body: JSON.stringify(input),
        })
        .json<Term>(),
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
      //For year switcher
      queryClient.setQueryData<Term[]>(
        termSwitcherQueryKey,
        (oldData) => oldData && [...oldData, addedTerm],
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
    mutationFn: (input: TermSchema) =>
      kyInstance
        .put("/api/terms", {
          body: JSON.stringify(input),
        })
        .json<Term>(),
    async onSuccess(updatedTerm) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Term[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.map((d) => (d.id === updatedTerm.id ? updatedTerm : d));
      });

      //For year switcher
      queryClient.setQueryData<Term[]>(
        termSwitcherQueryKey,
        (oldData) =>
          oldData &&
          oldData.map((d) => (d.id === updatedTerm.id ? updatedTerm : d)),
      );

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
    mutationFn: (id: string) =>
      kyInstance
        .delete("/api/terms", {
          body: JSON.stringify({ id }),
        })
        .json<string>(),
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

      //For year switcher
      queryClient.setQueryData<Term[]>(
        termSwitcherQueryKey,
        (oldData) => oldData && oldData.filter((d) => d.id !== id),
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
