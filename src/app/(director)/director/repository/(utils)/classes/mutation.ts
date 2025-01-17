"use client";

import { directorDashboardParamsQueryKey } from "@/app/(director)/hook";
import { toast } from "@/hooks/use-toast";
import { DirectorDashboardParam } from "@/lib/types";
import { Class } from "@prisma/client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { addClassAction, deleteClassAction, editClassAction } from "./action";

const queryKey: QueryKey = ["classes"];

export function useAddClassMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addClassAction,
    async onSuccess(addedClass) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Class[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return [...oldData, addedClass];
      });
      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) => oldData && { ...oldData, classes: oldData.classes + 1 },
      );

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to add class, please try again.!",
      });
    },
  });

  return mutation;
}

export function useUpdateClassMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editClassAction,
    async onSuccess(updatedClass) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Class[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.map((d) =>
          d.id === updatedClass.id ? updatedClass : d,
        );
      });

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update class, please try again.!",
      });
    },
  });

  return mutation;
}

export function useDeleteClassMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteClassAction,
    async onSuccess(id) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Class[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.filter((d) => d.id !== id);
      });
      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) => oldData && { ...oldData, classes: oldData.classes - 1 },
      );

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete class, please try again.!",
      });
    },
  });

  return mutation;
}
