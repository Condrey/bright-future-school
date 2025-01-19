"use client";

import { directorDashboardParamsQueryKey } from "@/app/(director)/hook";
import { toast } from "@/hooks/use-toast";
import { DirectorDashboardParam, LevelData } from "@/lib/types";
import { Level } from "@prisma/client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { addLevelAction, deleteLevelAction, editLevelAction } from "./action";

const queryKey: QueryKey = ["levels"];

export function useAddLevelMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addLevelAction,
    async onSuccess(addedLevel) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<LevelData[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return [...oldData, addedLevel];
      });
      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) => oldData && { ...oldData, levels: oldData.levels + 1 },
      );

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error, ) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to add level, please try again.!",
      });
    },
  });

  return mutation;
}

export function useUpdateLevelMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editLevelAction,
    async onSuccess(updatedLevel) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<LevelData[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.map((d) =>
          d.id === updatedLevel.id ? {...d,...updatedLevel} : d,
        );
      });

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update level, please try again.!",
      });
    },
  });

  return mutation;
}

export function useDeleteLevelMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteLevelAction,
    async onSuccess(id) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<LevelData[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.filter((d) => d.id !== id);
      });

      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) => oldData && { ...oldData, levels: oldData.levels - 1 },
      );

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete level, please try again.!",
      });
    },
  });

  return mutation;
}
