"use client";

import { directorDashboardParamsQueryKey } from "@/app/(director)/hook";
import { toast } from "@/hooks/use-toast";
import { PARAM_NAME_ACADEMIC_YEAR, PARAM_NAME_TERM } from "@/lib/constants";
import { DirectorDashboardParam, PupilData } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const year = searchParams.get(PARAM_NAME_ACADEMIC_YEAR)||'';
  const termId = searchParams.get(PARAM_NAME_TERM)||'';
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
      //For year term streams
      queryClient.invalidateQueries({
        queryKey: [
          "year-term-streams",
          !year || year.startsWith("<") ? "" : year,
          !termId || termId.startsWith("<") ? "" : termId,
        ],
      });
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
