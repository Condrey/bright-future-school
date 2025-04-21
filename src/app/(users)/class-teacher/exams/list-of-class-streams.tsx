"use client";

import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import { ClassStreamData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getClassTeacherClassStreams } from "../action";
import { ClassStreamWithExamsContainer } from "./class-stream-with-exams-container";

interface ListOfClassStreamsProps {
  classStreams: ClassStreamData[];
}

export default function ListOfClassStreams({
  classStreams: classStreams,
}: ListOfClassStreamsProps) {
  const query = useQuery({
    queryKey: ["class-teacher-class-streams"],
    queryFn: getClassTeacherClassStreams,
    initialData: classStreams,
    refetchOnWindowFocus: false,
  });

  const { data, status } = query;
  return (
    <div>
      {status === "error" ? (
        <ErrorContainer
          errorMessage="Unable to load class streams"
          query={query}
        />
      ) : status === "success" && !data.length ? (
        <EmptyContainer
          message={"No class streams to handle as class teacher"}
        />
      ) : (
        <div className="space-y-6">
          {data.map((classStream) => (
            <ClassStreamWithExamsContainer
              key={classStream.id}
              classStream={classStream}
            />
          ))}
        </div>
      )}
    </div>
  );
}
