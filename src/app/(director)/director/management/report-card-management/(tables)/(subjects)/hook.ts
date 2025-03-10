"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllAcademicYearClassSubjects, getAllSubjects } from "./action";

export const useAllSubjectsQuery = () =>
  useQuery({
    queryKey: ["subjects", "list"],
    queryFn: getAllSubjects,
  });

export const useFetchAcademicYearClassSubjectsQuery = ({
  academicYearId,
  classId,
}: {
  academicYearId: string;
  classId: string;
}) => {
  return useQuery({
    queryKey: [
      "academicYearSubjects",
      "class",
      classId,
      "academicYear",
      academicYearId,
    ],
    queryFn: async () =>
      getAllAcademicYearClassSubjects({ academicYearId, classId }),
  });
};
