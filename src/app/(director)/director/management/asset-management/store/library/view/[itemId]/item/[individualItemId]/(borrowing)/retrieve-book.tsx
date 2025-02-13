import LoadingButton from "@/components/loading-button";
import { useRetrieveBookMutation } from "./mutation";

interface RetrieveBookProps {
  individualBookId: string;
  borrowerId: string;
  disabled: boolean;
}

export default function RetrieveBook({
  individualBookId,
  borrowerId,
  disabled,
}: RetrieveBookProps) {
  const { isPending, mutate } = useRetrieveBookMutation();
  return (
    <LoadingButton
      disabled={disabled}
      loading={isPending}
      onClick={() => mutate({ individualBookId, borrowerId }, {})}
    >
      Retrieve
    </LoadingButton>
  );
}
