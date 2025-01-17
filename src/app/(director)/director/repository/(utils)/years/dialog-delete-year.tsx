import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { AcademicYear as Year } from "@prisma/client";
import { useDeleteYearMutation } from "./mutation";

interface DeleteYearDialogProps {
  year: Year;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteYear({
  year,
  open,
  openChange,
}: DeleteYearDialogProps) {
  const mutation = useDeleteYearMutation();

  async function handleDeletion() {
    try {
      mutation.mutate(year.id, {
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
      title={`Delete ${year.year}`}
      description="Please note that this change is irreversible. This will delete this year and all the associated data attached to it."
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
