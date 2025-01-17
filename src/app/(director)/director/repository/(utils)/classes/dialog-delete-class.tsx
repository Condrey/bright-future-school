import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { Class } from "@prisma/client";
import { useDeleteClassMutation } from "./mutation";

interface DeleteClassDialogProps {
  classValue: Class;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteClass({
  classValue,
  open,
  openChange,
}: DeleteClassDialogProps) {
  const mutation = useDeleteClassMutation();

  async function handleDeletion() {
    try {
      mutation.mutate(classValue.id, {
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
      title={`Delete ${classValue.name} class`}
      description="Please note that this change is irreversible."
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
