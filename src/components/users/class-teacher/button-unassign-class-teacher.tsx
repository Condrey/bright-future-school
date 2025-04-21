import LoadingButton from "@/components/loading-button";
import { useUnassignClassTeacherMutation } from "./mutation";

interface ButtonUnassignClassTeacherProps {
  classTeacherId: string;
  classStreamId: string;
  year?: string;
}

export default function ButtonUnassignClassTeacher({
  classStreamId,
  year,
  classTeacherId,
}: ButtonUnassignClassTeacherProps) {
  const mutation = useUnassignClassTeacherMutation(year);

  function handleClassTeacherAssignment() {
    mutation.mutate({ classStreamId, classTeacherId });
  }

  return (
    <LoadingButton
      loading={mutation.isPending}
      onClick={handleClassTeacherAssignment}
      className="w-fit"
      variant={"destructive"}
    >
      <span>Unassign</span>
    </LoadingButton>
  );
}
