"use client";

import { toast } from "@/hooks/use-toast";
import { PARAM_NAME_ACADEMIC_YEAR, PARAM_NAME_TERM } from "@/lib/constants";
import { TermWithYearData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  updateAnnualClassTerms,
  updateMultipleClassTerms,
  updateSingleClassTerm,
} from "./action";

export function useUpdateSingleTermMutation() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const academicYear = searchParams.get(PARAM_NAME_ACADEMIC_YEAR);
  const termId = searchParams.get(PARAM_NAME_TERM);

  const mutation = useMutation({
    mutationFn: updateSingleClassTerm,
    async onSuccess(updatedClassTerm) {
      console.log("academicYear", academicYear);
      console.log("termId", termId);
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
      await queryClient.cancelQueries({
        queryKey: ["pupils", "classStream", updatedClassTerm.classStreamId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pupils", "classStream", updatedClassTerm.classStreamId],
      });
      // For year term streams
      queryClient.setQueryData<TermWithYearData[]>(
        [
          "year-term-streams",
          !academicYear || academicYear.startsWith("<") ? "" : academicYear,
          !termId || termId.startsWith("<") ? "" : termId,
        ],
        (oldData) =>
          oldData &&
          oldData.map((d) =>
            d.id === updatedClassTerm.id ? updatedClassTerm : d,
          ),
      );
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
  const searchParams = useSearchParams();
  const academicYear = searchParams.get(PARAM_NAME_ACADEMIC_YEAR);
  const termId = searchParams.get(PARAM_NAME_TERM);

  const mutation = useMutation({
    mutationFn: updateMultipleClassTerms,
    async onSuccess(_, { input }) {
      // term year streams
      const queryKey: QueryKey = ["year-term-streams"];
      queryClient.invalidateQueries({ queryKey });
      // Class term details
      queryClient.invalidateQueries({
        queryKey: ["class-term"],
      });
      //Pupils class stream
      queryClient.invalidateQueries({ queryKey: ["pupils", "classStream"] });
      // For year term streams
      queryClient.invalidateQueries({
        queryKey: [
          "year-term-streams",
          !academicYear || academicYear.startsWith("<") ? "" : academicYear,
          !termId || termId.startsWith("<") ? "" : termId,
        ],
      });
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
  const searchParams = useSearchParams();
  const academicYear = searchParams.get(PARAM_NAME_ACADEMIC_YEAR);
  const termId = searchParams.get(PARAM_NAME_TERM);

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
      // For year term streams
      queryClient.invalidateQueries({
        queryKey: [
          "year-term-streams",
          !academicYear || academicYear.startsWith("<") ? "" : academicYear,
          !termId || termId.startsWith("<") ? "" : termId,
        ],
      });
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
