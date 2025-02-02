import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { LibraryBookData } from "@/lib/types";
import { useDeleteLibraryItemMutation } from "./mutation";

interface DeleteLibraryItemDialogProps {
  libraryItem: LibraryBookData;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteLibraryItem({
  libraryItem,
  open,
  openChange,
}: DeleteLibraryItemDialogProps) {
  const mutation = useDeleteLibraryItemMutation();

  async function handleDeletion() {
    try {
      mutation.mutate(libraryItem.id, {
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
      title={`Delete all ${libraryItem.author} ${libraryItem.title} books`}
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
