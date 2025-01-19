"use client";

import {
  directorDashboardParamsQueryKey,
  yearSwitcherQueryKey,
} from "@/app/(director)/hook";
import { toast } from "@/hooks/use-toast";
import kyInstance from "@/lib/ky";
import { DirectorDashboardParam } from "@/lib/types";
import { YearSchema } from "@/lib/validation";
import {  AcademicYear as Year } from "@prisma/client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

const queryKey: QueryKey = ["years"];

export function useAddYearMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: YearSchema) =>
      kyInstance
        .post("/api/academic-years", {
          body: JSON.stringify(input),
        })
        .json<Year>(),
    async onSuccess(addedYear) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Year[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return [...oldData, addedYear];
      });

      //For dashboard
      // Note: setting Query data for classStreams is not accurate,
      // but produces the results that we are looking for.
      // Incrementing by one makes the value greater than zero
      // Making it the result we are looking for upon onSuccess()
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) =>
          oldData && {
            ...oldData,
            academicYears: oldData.academicYears + 1,
            classStreams: oldData.classStreams + 1,
          },
      );
      //For year switcher
      queryClient.setQueryData<Year[]>(
        yearSwitcherQueryKey,
        (oldData) => oldData && [...oldData, addedYear],
      );

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);

      toast({
        variant: "destructive",
        description: `Failed to add year, please try again.! `,
      });
    },
  });

  return mutation;
}

export function useUpdateYearMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: YearSchema) =>
      kyInstance
        .put("/api/academic-years", {
          body: JSON.stringify(input),
        })
        .json<Year>(),
    async onSuccess(updatedYear) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Year[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.map((d) => (d.id === updatedYear.id ? updatedYear : d));
      });

      //For year switcher
      queryClient.setQueryData<Year[]>(
        yearSwitcherQueryKey,
        (oldData) =>
          oldData &&
          oldData.map((d) => (d.id === updatedYear.id ? updatedYear : d)),
      );

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update year, please try again.!",
      });
    },
  });

  return mutation;
}

export function useDeleteYearMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      kyInstance
        .delete("/api/academic-years", {
          body: JSON.stringify({id}),
        })
        .json<string>(),
    async onSuccess(id) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Year[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.filter((d) => d.id !== id);
      });

      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) =>
          oldData && { ...oldData, academicYears: oldData.academicYears - 1 },
      );
      //For year switcher
      queryClient.setQueryData<Year[]>(
        yearSwitcherQueryKey,
        (oldData) => oldData && oldData.filter((d) => d.id !== id),
      );

      queryClient.invalidateQueries({
        queryKey: directorDashboardParamsQueryKey,
      });

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete year, please try again.!",
      });
    },
  });

  return mutation;
}
