import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { AssetData } from "@/lib/types";
import { useDeleteAssetMutation } from "./mutation";

interface DeleteAssetDialogProps {
  asset: AssetData;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteAsset({
  asset,
  open,
  openChange,
}: DeleteAssetDialogProps) {
  const mutation = useDeleteAssetMutation();

  async function handleDeletion() {
    try {
      mutation.mutate(asset.id, {
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
      title={`Delete ${asset.name}`}
      description="Please note that this change is irreversible. This will delete this asset and all the associated data attached to it."
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
