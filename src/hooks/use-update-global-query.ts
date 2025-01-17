import { yearClassStreamsQueryKey } from "@/app/(director)/director/repository/(users)/utils";
import { ClassStreamData } from "@/lib/types";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function UseUpdateGlobalQuery() {
  const queryCLient = useQueryClient();

  const updateYearQuery = useCallback(
    async (year: string) => {
      await queryCLient.cancelQueries();
      queryCLient.setQueryData<ClassStreamData[]>(
        yearClassStreamsQueryKey(year),
        (oldData) =>
          oldData &&
          oldData.filter((d) => d.class?.academicYear?.year === year),
      );
    },
    [QueryClient],
  );

  return { updateYearQuery };
}
