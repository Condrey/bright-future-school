"use clients";

import { LevelData } from "@/lib/types";
import { Level } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getLevelsAction } from "./action";

export function useGetAllLevelsQuery() {
  return useQuery({
    queryKey: ["levels"],
    queryFn: getLevelsAction,
  });
}

export function useGetAllLevelsWithInitialDataQuery(initialData: LevelData[]) {
  return useQuery({
    queryKey: ["levels"],
    queryFn: getLevelsAction,
    initialData: initialData,
  });
}
