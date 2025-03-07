"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllSubjects } from "./action";

export const useAllSubjectsQuery = ()=>useQuery({
    queryKey: ["subjects", "list"],
    queryFn: getAllSubjects,
  });
