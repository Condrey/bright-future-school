import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { Stream } from "@prisma/client";
import { useDeleteStreamMutation } from "./mutation";

interface DeleteStreamDialogProps {
  stream: Stream;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteStream({
  stream,
  open,
  openChange,
}: DeleteStreamDialogProps) {
  const mutation = useDeleteStreamMutation();

  async function handleDeletion() {
    try {
      mutation.mutate(stream.id, {
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
      title={`Delete ${stream.name} stream`}
      description="Please note that this change is irreversible. This will delete this stream and all the associated data attached to it."
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