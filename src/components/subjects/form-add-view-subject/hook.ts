"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllLevelsWithSubjects } from "./action";

export const useGetAllLevelsWithSubjectsQuery = () =>
  useQuery({
    queryKey: ["levels-with-subjects", "list"],
    queryFn: getAllLevelsWithSubjects,
  });
