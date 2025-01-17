import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { StaffData as TeachingStaff } from "@/lib/types";
import { useDeleteTeachingStaffMutation } from "./mutation";

interface DeleteTeachingStaffDialogProps {
  teachingStaff: TeachingStaff;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteTeachingStaff({
  teachingStaff,
  open,
  openChange,
}: DeleteTeachingStaffDialogProps) {
  const mutation = useDeleteTeachingStaffMutation();

  async function handleDeletion() {
    try {
      mutation.mutate(
        { userId: teachingStaff.userId!, staffId: teachingStaff.id },
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
      title={`Delete ${teachingStaff.user?.name}`}
      description="Please note that this change is irreversible. This will delete this teachingStaff and all the associated data attached to it."
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
