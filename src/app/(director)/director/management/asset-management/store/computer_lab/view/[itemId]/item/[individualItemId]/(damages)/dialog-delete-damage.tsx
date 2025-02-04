import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { AssetDamageData } from "@/lib/types";
import { useDeleteItemDamageMutation } from "./mutation";

interface DeleteDamageDialogProps {
  damage: AssetDamageData;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteDamage({
  damage,
  open,
  openChange,
}: DeleteDamageDialogProps) {
  const mutation = useDeleteItemDamageMutation();

  async function handleDeletion() {
    try {
      mutation.mutate(damage.id, {
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
      title={`Delete this damage ${!damage.isSchoolCost && !!damage.damagedBy ? `by ${damage.damagedBy.name}` : "under school cost"}`}
      description="Please note that this change is irreversible. This will delete this Damage and all the associated data attached to it."
      className="max-w-md"
    >
      <div className="damages-center flex w-full justify-end gap-4">
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
