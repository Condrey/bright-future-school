"use client";

import { directorDashboardParamsQueryKey } from "@/app/(director)/hook";
import { toast } from "@/hooks/use-toast";
import {
  DirectorDashboardParam,
  StaffData as NonTeachingStaff,
} from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addNonTeachingStaffAction,
  deleteNonTeachingStaffAction,
  editNonTeachingStaffAction,
} from "./action";

const queryKey: QueryKey = ["nonTeachingStaffs"];

export function useAddNonTeachingStaffMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addNonTeachingStaffAction,
    async onSuccess(addedNonTeachingStaff) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<NonTeachingStaff[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return [...oldData, addedNonTeachingStaff];
      });

      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) =>
          oldData && {
            ...oldData,
            nonTeachingStaffs: oldData.nonTeachingStaffs + 1,
          },
      );
      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to add nonTeachingStaff, please try again.!",
      });
    },
  });

  return mutation;
}

export function useUpdateNonTeachingStaffMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editNonTeachingStaffAction,
    async onSuccess(updatedNonTeachingStaff) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<NonTeachingStaff[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.map((d) =>
          d.id === updatedNonTeachingStaff?.id ? updatedNonTeachingStaff : d,
        );
      });

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update nonTeachingStaff, please try again.!",
      });
    },
  });

  return mutation;
}

export function useDeleteNonTeachingStaffMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteNonTeachingStaffAction,
    async onSuccess(id, { staffId }) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<NonTeachingStaff[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.filter((d) => d.id !== staffId);
      });

      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) =>
          oldData && {
            ...oldData,
            nonTeachingStaffs: oldData.nonTeachingStaffs - 1,
          },
      );

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete nonTeachingStaff, please try again.!",
      });
    },
  });

  return mutation;
}
