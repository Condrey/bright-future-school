"use client";

import { toast } from "@/hooks/use-toast";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertAcademicYYearClassSubjects } from "./action";

const queryKey: QueryKey = ["list-of-class-streams"];
const queryKey1: QueryKey = ["class-teacher-class-streams"];

export function useUpsertAcademicYearClassMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertAcademicYYearClassSubjects,
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKey1 });

      toast({ description: "Subjects updated successfully" });
    },
    onError: (error) => {
      console.error(error);
      toast({ description: "Failed to perform action. Please try again.!" });
    },
  });
}
