"use client";

import { toast } from "@/hooks/use-toast";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExam, upsertExam } from "./action";

const queryKey: QueryKey = ["levels-with-subjects", "list"];

export function useUpsertExamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertExam,
    onSuccess: async (data,variables) => {
      const key2 :QueryKey= ["classTerms-with-exams", data.classTerm.classStreamId];
      const key3: QueryKey = ["list-of-class-streams"];
      const key4:QueryKey = ["list-of-terms",'classStream', data.classTerm.classStreamId]

      await queryClient.cancelQueries({ queryKey });

      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: key2 });
      queryClient.invalidateQueries({ queryKey: key3 });
      queryClient.invalidateQueries({ queryKey: key4 });
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

export function useDeleteExamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExam,
    onSuccess: async (data) => {
      const key2:QueryKey = ["classTerms-with-exams", data.classTerm.classStreamId];
      const key3: QueryKey = ["list-of-class-streams"];
      const key4:QueryKey = ["list-of-terms",'classStream', data.classTerm.classStreamId]

      await queryClient.cancelQueries({ queryKey });

      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: key2 });
      queryClient.invalidateQueries({ queryKey: key3 });
      queryClient.invalidateQueries({ queryKey: key4 });
      toast({
        description: "Successfully deleted exam",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({ description: "Failed to delete exam", variant: "destructive" });
    },
  });
}
