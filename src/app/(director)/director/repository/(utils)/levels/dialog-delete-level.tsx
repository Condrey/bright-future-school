import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { Level } from "@prisma/client";
import { useDeleteLevelMutation } from "./mutation";

interface DeleteLevelDialogProps {
  level: Level;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteLevel({
  level,
  open,
  openChange,
}: DeleteLevelDialogProps) {
  const mutation = useDeleteLevelMutation();

  async function handleDeletion() {
    try {
      mutation.mutate(level.id, {
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
      title={`Delete ${level.name} level`}
      description="Please note that this change is irreversible. This will delete this level and all the associated data attached to it."
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
