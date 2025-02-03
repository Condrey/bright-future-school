import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { GeneralStoreItemData } from "@/lib/types";
import { useDeleteGeneralStoreItemMutation } from "./mutation";

interface DeleteGeneralStoreItemDialogProps {
  generalStoreItem: GeneralStoreItemData;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteGeneralStoreItem({
  generalStoreItem,
  open,
  openChange,
}: DeleteGeneralStoreItemDialogProps) {
  const mutation = useDeleteGeneralStoreItemMutation();

  async function handleDeletion() {
    try {
      mutation.mutate(generalStoreItem.id, {
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
      title={`Delete all ${generalStoreItem.name} variants`}
      description="Please note that this change is irreversible. This will delete this general store Item and all the associated data attached to it."
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
