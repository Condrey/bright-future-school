"use client";

import { toast } from "@/hooks/use-toast";
import { TermWithYearData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateAnnualClassTerms,
  updateMultipleClassTerms,
  updateSingleClassTerm,
} from "./action";

export function useUpdateSingleTermMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateSingleClassTerm,
    async onSuccess(updatedClassTerm) {
      // term year streams
      const queryKey: QueryKey = ["year-term-streams"];
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<TermWithYearData[]>(
        queryKey,
        (oldData) =>
          oldData &&
          oldData.map((d) =>
            d.id === updatedClassTerm.id ? updatedClassTerm : d,
          ),
      );
      // Class term details
      queryClient.setQueryData<TermWithYearData>(
        ["class-term", updatedClassTerm.id],
        (_) => updatedClassTerm,
      );
      //Pupils class stream
      queryClient.invalidateQueries({ queryKey: ["pupils", "classStream"] });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to update term, please try again.!",
        variant: "destructive",
      });
    },
  });
  return mutation;
}

export function useUpdateMultipleClassTerms() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateMultipleClassTerms,
    async onSuccess() {
      // term year streams
      const queryKey: QueryKey = ["year-term-streams"];
      queryClient.invalidateQueries({ queryKey });
      // Class term details
      queryClient.invalidateQueries({
        queryKey: ["class-term"],
      });
      //Pupils class stream
      queryClient.invalidateQueries({ queryKey: ["pupils", "classStream"] });
    },
    onError(error) {
      console.error(error);
      toast({
        description:
          "Failed to update term for all streams, please try again.!",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
export function useUpdateAnnualClassTerms() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateAnnualClassTerms,
    async onSuccess() {
      // term year streams
      const queryKey: QueryKey = ["year-term-streams"];
      queryClient.invalidateQueries({ queryKey });
      // Class term details
      queryClient.invalidateQueries({
        queryKey: ["class-term"],
      });
      //Pupils class stream
      queryClient.invalidateQueries({ queryKey: ["pupils", "classStream"] });
    },
    onError(error) {
      console.error(error);
      toast({
        description:
          "Failed to update term for entire academic year, please try again.!",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
