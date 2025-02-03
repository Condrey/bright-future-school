import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { FoodStoreItemData } from "@/lib/types";
import { useDeleteFoodStoreItemMutation } from "./mutation";

interface DeleteFoodStoreItemDialogProps {
  foodStoreItem: FoodStoreItemData;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteFoodStoreItem({
  foodStoreItem,
  open,
  openChange,
}: DeleteFoodStoreItemDialogProps) {
  const mutation = useDeleteFoodStoreItemMutation();

  async function handleDeletion() {
    try {
      mutation.mutate(foodStoreItem.id, {
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
      title={`Delete all ${foodStoreItem.foodName} variants`}
      description="Please note that this change is irreversible. This will delete this food store Item and all the associated data attached to it."
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
