"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllGrading } from "./action";
import { Grading } from "@prisma/client";

export function useGetAllGradingWithInitialData(initialData:Grading[]) {
  return useQuery({
    queryKey: ["grading-list"],
    queryFn: getAllGrading,
    initialData,
  });
}

export function useGetAllGrading() {
  return useQuery({
    queryKey: ["grading-list"],
    queryFn: getAllGrading,
  });
}