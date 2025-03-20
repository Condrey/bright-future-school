"use client";

import { ClassStreamData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getAllClassStreams } from "./action";

export function useGetAllClassStreamsQueryWithInitialData(
  classStreams: ClassStreamData[],
) {
  return useQuery({
    queryKey: ["list-of-class-streams"],
    queryFn: getAllClassStreams,
    initialData: classStreams,
    // staleTime: Infinity,
  });
}
