import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { ClassTeacherData as ClassTeacher } from "@/lib/types";
import { useDeleteTeachingStaffMutation } from "../../../teaching-staffs/mutation";

interface DeleteClassTeacherDialogProps {
  classTeacher: ClassTeacher;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteClassTeacher({
  classTeacher,
  open,
  openChange,
}: DeleteClassTeacherDialogProps) {
  const mutation = useDeleteTeachingStaffMutation();

  async function handleDeletion() {
    try {
      mutation.mutate(
        { userId: classTeacher.userId!, staffId: classTeacher.id },
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
      title={`Delete ${classTeacher.user?.name} from database`}
      className="max-w-md"
    >
      <p>
        You are <strong className="font-bold text-destructive">removing</strong>{" "}
        the staff,
        <cite>{classTeacher.user?.name}</cite> and all their information away
        from the database, are you sure that you want to continue?
      </p>
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
