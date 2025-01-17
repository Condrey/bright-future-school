"use client";

import { directorDashboardParamsQueryKey } from "@/app/(director)/hook";
import { toast } from "@/hooks/use-toast";
import { ClassStreamData, DirectorDashboardParam } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addClassStreamAction,
  deleteClassStreamAction,
  editClassStreamAction,
} from "./action";

const queryKey: QueryKey = ["classStreams"];

export function useAddClassStreamMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addClassStreamAction,
    async onSuccess(addedClassStream) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<ClassStreamData[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return [...oldData, addedClassStream];
      });
      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) =>
          oldData && { ...oldData, classStreams: oldData.classStreams + 1 },
      );

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to add classStream, please try again.!",
      });
    },
  });

  return mutation;
}

export function useUpdateClassStreamMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editClassStreamAction,
    async onSuccess(updatedClassStream) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<ClassStreamData[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.map((d) =>
          d.id === updatedClassStream.id ? updatedClassStream : d,
        );
      });

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update classStream, please try again.!",
      });
    },
  });

  return mutation;
}

export function useDeleteClassStreamMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteClassStreamAction,
    async onSuccess(id) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<ClassStreamData[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.filter((d) => d.id !== id);
      });

      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) =>
          oldData && { ...oldData, classStreams: oldData.classStreams - 1 },
      );

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete classStream, please try again.!",
      });
    },
  });

  return mutation;
}
