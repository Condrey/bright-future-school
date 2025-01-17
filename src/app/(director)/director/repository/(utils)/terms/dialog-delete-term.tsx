import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { Term } from "@prisma/client";
import { useDeleteTermMutation } from "./mutation";

interface DeleteTermDialogProps {
  term: Term;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteTerm({
  term,
  open,
  openChange,
}: DeleteTermDialogProps) {
  const mutation = useDeleteTermMutation();

  async function handleDeletion() {
    try {
      mutation.mutate(term.id, {
        onSuccess() {
          openChange(false);
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={openChange}
      title={`Delete ${term.term}`}
      description="Please note that this change is irreversible. This will delete this term and all the associated data attached to it."
      className="max-w-md"
    >
      <div className="flex w-full items-center justify-end gap-4">
        <Button variant="outline" onClick={() => openChange(false)}>
          Cancel
        </Button>
        <LoadingButton
          loading={mutation.isPending}
          variant="destructive"
          onClick={handleDeletion}
        >
          Delete
        </LoadingButton>
      </div>
    </ResponsiveDrawer>
  );
}
