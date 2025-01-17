"use client";

import { directorDashboardParamsQueryKey } from "@/app/(director)/hook";
import { toast } from "@/hooks/use-toast";
import {
  ClassTeacherWithYearData,
  DirectorDashboardParam,
  StaffData as TeachingStaff,
} from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addTeachingStaffAction,
  deleteTeachingStaffAction,
  editTeachingStaffAction,
} from "./action";

const queryKey: QueryKey = ["teachingStaffs"];

export function useAddTeachingStaffMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addTeachingStaffAction,
    async onSuccess(addedTeachingStaff) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<TeachingStaff[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return [...oldData, addedTeachingStaff];
      });

      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) =>
          oldData && { ...oldData, teachingStaffs: oldData.teachingStaffs + 1 },
      );
      // for class teacher
      queryClient.invalidateQueries({ queryKey: ["class-teachers"] });

      //For class streams
      queryClient.invalidateQueries({ queryKey: ["year-class-streams"] });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to add teachingStaff, please try again.!",
      });
    },
  });

  return mutation;
}

export function useUpdateTeachingStaffMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editTeachingStaffAction,
    async onSuccess(updatedTeachingStaff) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<TeachingStaff[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.map((d) =>
          d.id === updatedTeachingStaff?.id ? updatedTeachingStaff : d,
        );
      });

      // for class teacher
      queryClient.setQueryData<ClassTeacherWithYearData[]>(
        ["class-teachers"],
        (oldData) =>
          oldData &&
          oldData.map((d) =>
            d.id === updatedTeachingStaff?.id
              ? { ...d, user: updatedTeachingStaff.user }
              : d,
          ),
      );
      //For class streams
      queryClient.invalidateQueries({ queryKey: ["year-class-streams"] });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update teachingStaff, please try again.!",
      });
    },
  });

  return mutation;
}

export function useDeleteTeachingStaffMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteTeachingStaffAction,
    async onSuccess(id, { staffId }) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<TeachingStaff[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.filter((d) => d.id !== staffId);
      });

      // for class teacher
      queryClient.setQueryData<ClassTeacherWithYearData[]>(
        ["class-teachers"],
        (oldData) => oldData && oldData.filter((d) => d.id !== staffId),
      );

      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) =>
          oldData && { ...oldData, teachingStaffs: oldData.teachingStaffs - 1 },
      );

      //For class streams
      queryClient.invalidateQueries({ queryKey: ["year-class-streams"] });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete teachingStaff, please try again.!",
      });
    },
  });

  return mutation;
}
