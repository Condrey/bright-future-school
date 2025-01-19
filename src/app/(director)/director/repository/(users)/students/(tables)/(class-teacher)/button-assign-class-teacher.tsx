import LoadingButton from "@/components/loading-button";
import { ClassTeacherData } from "@/lib/types";
import { useAssignClassTeacherMutation } from "./mutation";

interface ButtonAssignClassTeacherProps {
  classTeacher: ClassTeacherData;
  classStreamId: string;
  year: string;
}

export default function ButtonAssignClassTeacher({
  classTeacher,
   classStreamId,
  year,
}: ButtonAssignClassTeacherProps) {
  const mutation = useAssignClassTeacherMutation(year);

  function handleClassTeacherAssignment() {
    mutation.mutate({ classTeacher, classStreamId });
  }

  return (
    <LoadingButton
      loading={mutation.isPending}
      onClick={handleClassTeacherAssignment}
      className="w-fit"
    >
      <span>Assign</span>
    </LoadingButton>
  );
}
