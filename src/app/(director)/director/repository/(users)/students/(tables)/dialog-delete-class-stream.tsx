import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { ClassStreamData } from "@/lib/types";
import { useDeleteClassStreamMutation } from "./mutation";

interface DeleteClassStreamDialogProps {
  classStream: ClassStreamData;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteClassStream({
  classStream,
  open,
  openChange,
}: DeleteClassStreamDialogProps) {
  const mutation = useDeleteClassStreamMutation();

  async function handleDeletion() {
    try {
      mutation.mutate(classStream.id, {
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
      title={`Delete ${classStream.stream?.name} classStream`}
      description="Please note that this change is irreversible. This will delete this classStream and all the associated data attached to it."
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
