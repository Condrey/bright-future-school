"use client";

import { StaffData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  getClassPupils,
  getClassTeachers,
} from "../../app/(director)/director/repository/(users)/action";
import { getTeachingStaffsAction } from "../../app/(director)/director/repository/(users)/teaching-staffs/action";

export function useFetchTeachingStaffs({
  initialData,
}: {
  initialData: StaffData[];
}) {
  const query = useQuery({
    queryKey: ["teachingStaffs"],
    queryFn: getTeachingStaffsAction,
    initialData: initialData,
  });
  return query;
}

export function useFetchClassTeachers({ year }: { year: string }) {
  const query = useQuery({
    queryKey: ["class-teachers"],
    queryFn: async () => getClassTeachers(year),
    staleTime: Infinity,
  });
  return query;
}

export function useFetchPupils({
  year,
  classId,
  classStreamId,
  streamId,
}: {
  year: string;
  classId: string;
  classStreamId: string;
  streamId: string;
}) {
  const query = useQuery({
    queryKey: ["pupils", classStreamId],
    queryFn: async () => getClassPupils(year, classId, streamId),
    staleTime: Infinity,
  });
  return query;
}
