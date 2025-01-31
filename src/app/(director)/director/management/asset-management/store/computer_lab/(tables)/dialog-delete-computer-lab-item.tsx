import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { ComputerLabItemData } from "@/lib/types";
import { useDeleteComputerLabItemMutation } from "./mutation";

interface DeleteComputerLabItemDialogProps {
  computerLabItem: ComputerLabItemData;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteComputerLabItem({
  computerLabItem,
  open,
  openChange,
}: DeleteComputerLabItemDialogProps) {
  const mutation = useDeleteComputerLabItemMutation();

  async function handleDeletion() {
    try {
      mutation.mutate(computerLabItem.id, {
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
      title={`Delete ${computerLabItem.name}`}
      description="Please note that this change is irreversible. This will delete this computer Lab Item and all the associated data attached to it."
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
