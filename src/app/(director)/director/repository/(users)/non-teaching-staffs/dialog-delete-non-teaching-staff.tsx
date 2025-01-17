import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { StaffData as NonTeachingStaff } from "@/lib/types";
import { useDeleteNonTeachingStaffMutation } from "./mutation";

interface DeleteNonTeachingStaffDialogProps {
  nonTeachingStaff: NonTeachingStaff;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteNonTeachingStaff({
  nonTeachingStaff,
  open,
  openChange,
}: DeleteNonTeachingStaffDialogProps) {
  const mutation = useDeleteNonTeachingStaffMutation();

  async function handleDeletion() {
    try {
      mutation.mutate(
        { userId: nonTeachingStaff.userId!, staffId: nonTeachingStaff.id },
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
      title={`Delete ${nonTeachingStaff.user?.name}`}
      description="Please note that this change is irreversible. This will delete this nonTeachingStaff and all the associated data attached to it."
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
