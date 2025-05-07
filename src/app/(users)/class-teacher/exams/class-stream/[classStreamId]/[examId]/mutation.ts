"use client";

import { toast } from "@/hooks/use-toast";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertExamScores, upsertExamSubjects } from "./action";

export function useUpdateExamSubjectsMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: upsertExamSubjects,
    async onSuccess(data, variables, context) {
      const queryKey: QueryKey = ["exam-with-pupils", variables.examId];
      await queryClient.cancelQueries({ queryKey });

      queryClient.invalidateQueries({ queryKey });
      toast({ description: "Successfully updated exam subjects" });
    },
    onError(error, variables, context) {
      console.error(error);
      toast({ description: "Failed to update exam subjects" });
    },
  });
  return mutation;
}

export function useUpdateExamScoresMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: upsertExamScores,
    async onSuccess(data, variables, context) {
      const queryKey: QueryKey = ["exam-with-pupils"];
      await queryClient.cancelQueries({ queryKey });

      queryClient.invalidateQueries({ queryKey });
      toast({ description: "Successfully updated exam scores" });
    },
    onError(error, variables, context) {
      console.error(error);
      toast({ description: "Failed to update exam scores" });
    },
  });
  return mutation;
}
