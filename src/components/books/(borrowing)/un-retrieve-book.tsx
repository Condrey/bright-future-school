import LoadingButton from "@/components/loading-button";
import { useUnRetrieveBookMutation } from "./mutation";

interface RetrieveBookProps {
  individualBookId: string;
  borrowerId: string;
}

export default function UnRetrieveBook({
  individualBookId,
  borrowerId,
}: RetrieveBookProps) {
  const { isPending, mutate } = useUnRetrieveBookMutation();
  return (
    <LoadingButton
      variant={"destructive"}
      loading={isPending}
      onClick={() => mutate({ individualBookId, borrowerId }, {})}
    >
      Undo Retrieve
    </LoadingButton>
  );
}
