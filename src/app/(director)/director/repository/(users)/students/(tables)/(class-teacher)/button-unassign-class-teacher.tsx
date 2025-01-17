import LoadingButton from "@/components/loading-button";
import { useUnassignClassTeacherMutation } from "./mutation";

interface ButtonUnassignClassTeacherProps {
  streamId: string;
  year: string;
}

export default function ButtonUnassignClassTeacher({
  streamId,
  year,
}: ButtonUnassignClassTeacherProps) {
  const mutation = useUnassignClassTeacherMutation(year);

  function handleClassTeacherAssignment() {
    mutation.mutate({ streamId });
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
