import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { IndividualComputerLabItemData } from "@/lib/types";
import { useDeleteItemMutation } from "./mutation";

interface DeleteItemDialogProps {
  item: IndividualComputerLabItemData;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteItem({
  item,
  open,
  openChange,
}: DeleteItemDialogProps) {
  const mutation = useDeleteItemMutation(item.computerLabItemId);

  async function handleDeletion() {
    try {
      mutation.mutate(item.id, {
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
      title={`Delete ${item.computerLabItem.name} with ${item.uniqueIdentifier || "unknown"} identifier`}
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
