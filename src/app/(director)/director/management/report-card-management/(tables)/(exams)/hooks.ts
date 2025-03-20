"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllTermsWithExams as getAllClassTermsWithExams } from "./action";

export const useGetAllClassTermsWithExamsQuery = ({
  classStreamId,
  academicYearClassId,
}: {
  classStreamId: string;
  academicYearClassId: string;
}) =>
  useQuery({
    queryKey: ["classTerms-with-exams", academicYearClassId, classStreamId],
    queryFn: async () => getAllClassTermsWithExams(classStreamId),
  });
