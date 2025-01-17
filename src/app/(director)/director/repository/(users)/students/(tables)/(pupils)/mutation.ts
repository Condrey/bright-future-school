"use client";

import { directorDashboardParamsQueryKey } from "@/app/(director)/hook";
import { toast } from "@/hooks/use-toast";
import { DirectorDashboardParam, PupilData } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addPupilsFromPreviousYearSameStream,
  addPupilsFromSameClassSameStream,
  addUnregisteredPupil,
} from "./action";

//   . From the previous year but same stream name.
export function useAddPupilsFromPreviousYearSameStream() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addPupilsFromPreviousYearSameStream,
  });
  return mutation;
}
//  . From the same class but another Stream
export function useAddPupilsFromSameClassSameStream() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addPupilsFromSameClassSameStream,
  });
  return mutation;
}

//               . New pupil from another school or unregistered pupil
export function useAddUnregisteredPupil() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addUnregisteredPupil,
    onSuccess: async (registeredPupil, variables) => {
      if (!registeredPupil) return;
      await queryClient.cancelQueries();
      // for this particular stream
      queryClient.setQueryData<PupilData[]>(
        ["pupils", variables.classStreamId],
        (oldData) => oldData && [...oldData, registeredPupil],
      );
      // For the dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) => oldData && { ...oldData, pupils: oldData.pupils + 1 },
      );
      // For classStreams
      queryClient.invalidateQueries({ queryKey: ["year-class-streams"] });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to add pupil/ student.",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
