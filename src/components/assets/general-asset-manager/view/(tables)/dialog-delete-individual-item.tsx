import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { IndividualGeneralStoreItemData } from "@/lib/types";
import { useDeleteItemMutation } from "./mutation";

interface DeleteIndividualItemDialogProps {
  item: IndividualGeneralStoreItemData;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteIndividualItem({
  item,
  open,
  openChange,
}: DeleteIndividualItemDialogProps) {
  const mutation = useDeleteItemMutation(item.generalStoreItemId);

  async function handleDeletion() {
    try {
      mutation.mutate(
        { id: item.id, generalStoreItemId: item.generalStoreItemId },
        {
          onSuccess() {
            openChange(false);
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={openChange}
      title={`Delete ${item.generalStoreItem.name} with ${item.uniqueIdentifier || "unknown"} unique uniqueIdentifier`}
      description="Please note that this change is irreversible. This will delete this library Item and all the associated data attached to it."
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
