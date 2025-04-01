"use client";

import { toast } from "@/hooks/use-toast";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertExam, upsertExamWholeClass } from "./action";

const queryKey: QueryKey = ["levels-with-subjects", "list"];

export function useUpsertExamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertExam,
    onSuccess: async (data) => {
      const key2 = ["classTerms-with-exams", data.classTerm.classStreamId];
      const key3: QueryKey = ["list-of-class-streams"];

      await queryClient.cancelQueries({ queryKey });

      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: key2 });
      queryClient.invalidateQueries({ queryKey: key3 });
      toast({
        description: "Successfully updated exam",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({ description: "Failed to update exam", variant: "destructive" });
    },
  });
}

export function useUpsertExamWholeClassMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertExamWholeClass,
    onSuccess: async (data) => {
      const key2 = ["classTerms-with-exams"];
      const key3: QueryKey = ["list-of-class-streams"];

      await queryClient.cancelQueries({ queryKey });

      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: key2 });
      queryClient.invalidateQueries({ queryKey: key3 });
      toast({
        description: "Successfully updated exam for all the classes.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        description: "Failed to update exam for all the classes.",
        variant: "destructive",
      });
    },
  });
}
