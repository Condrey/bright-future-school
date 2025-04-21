"use client";

import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import { ClassStreamData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getClassTeacherClassStreams } from "./action";
import { ClassStreamWithSubjectContainer } from "./class-stream-with-subject-container";

interface ListOfClassStreamsProps {
  classStream: ClassStreamData[];
}

export default function ListOfClassStreams({
  classStream,
}: ListOfClassStreamsProps) {
  const query = useQuery({
    queryKey: ["class-teacher-class-streams"],
    queryFn: getClassTeacherClassStreams,
    initialData: classStream,
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
            <ClassStreamWithSubjectContainer
              key={classStream.id}
              classStream={classStream}
            />
          ))}
        </div>
      )}
    </div>
  );
}
