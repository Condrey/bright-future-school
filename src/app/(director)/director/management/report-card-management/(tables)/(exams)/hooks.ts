"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllTermsWithExams as getAllClassTermsWithExams } from "./action";

export const useGetAllClassTermsWithExamsQuery = ({
  classStreamId,
}: {
  classStreamId: string;
}) =>
  useQuery({
    queryKey: ["classTerms-with-exams", classStreamId],
    queryFn: async () => getAllClassTermsWithExams(classStreamId),
  });
