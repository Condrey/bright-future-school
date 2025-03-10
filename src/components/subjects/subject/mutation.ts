"use client";

import { directorDashboardParamsQueryKey } from "@/app/(director)/hook";
import { toast } from "@/hooks/use-toast";
import kyInstance from "@/lib/ky";
import { DirectorDashboardParam } from "@/lib/types";
import { Subject } from "@prisma/client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { addSubjectAction, editSubjectAction } from "./action";

const queryKey: QueryKey = ["subjects"];

export function useAddSubjectMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    // mutationFn: (input: SubjectSchema) =>
    //   kyInstance
    //     .post("/api/subjects", {
    //       body: JSON.stringify(input),
    //     })
    //     .json<Subject>(),
    mutationFn: addSubjectAction,
    async onSuccess(addedSubject) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Subject[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return [...oldData, addedSubject];
      });

      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) => oldData && { ...oldData, subjects: oldData.subjects + 1 },
      );

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to add subject, please try again.!",
      });
    },
  });

  return mutation;
}

export function useUpdateSubjectMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    // mutationFn: (input: SubjectSchema) =>
    //   kyInstance
    //     .put("/api/subjects", {
    //       body: JSON.stringify(input),
    //     })
    //     .json<Subject>(),
    mutationFn: editSubjectAction,
    async onSuccess(updatedSubject) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Subject[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.map((d) =>
          d.id === updatedSubject.id ? updatedSubject : d,
        );
      });

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update subject, please try again.!",
      });
    },
  });

  return mutation;
}

export function useDeleteSubjectMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      kyInstance
        .delete("/api/subjects", {
          body: JSON.stringify({ id }),
        })
        .json<string>(),
    async onSuccess(id) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Subject[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.filter((d) => d.id !== id);
      });
      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) => oldData && { ...oldData, subjects: oldData.subjects - 1 },
      );

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete subject, please try again.!",
      });
    },
  });

  return mutation;
}
