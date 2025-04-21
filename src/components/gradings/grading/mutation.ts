"use client";

import { toast } from "@/hooks/use-toast";
import { Grading } from "@prisma/client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGrading, upsertGrading } from "./action";

const queryKey: QueryKey = ["grading-list"];

export const useUpsertGradingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertGrading,
    async onSuccess(data, variables) {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<Grading[]>(queryKey, (old) => {
        if (!old) return;
        if (!variables.id) {
          return [...old, data];
        }
        return old.map((d) => (d.id === variables.id ? data : d));
      });
      toast({ description: "Successfully updated grading." });
    },
    onError(error) {
      console.error("Upsert error: ", error.message);
      toast({
        description: "Failed to perform operation. Please try again!",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteGradingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGrading,
    async onSuccess(data, variables) {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<Grading[]>(
        queryKey,
        (old) => old && old.filter((d) => d.id !== data.id),
      );
      toast({ description: "Successfully deleted grading." });
    },
    onError(error) {
      console.error("Delete error: ", error.message);
      toast({
        description: "Failed to perform operation. Please try again!",
        variant: "destructive",
      });
    },
  });
};
