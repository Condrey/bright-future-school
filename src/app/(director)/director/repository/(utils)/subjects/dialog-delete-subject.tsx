import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { Subject } from "@prisma/client";
import { useDeleteSubjectMutation } from "./mutation";

interface DeleteSubjectDialogProps {
  subject: Subject;
  open: boolean;
  openChange: (open: boolean) => void;
}

export default function DialogDeleteSubject({
  subject,
  open,
  openChange,
}: DeleteSubjectDialogProps) {
  const mutation = useDeleteSubjectMutation();

  async function handleDeletion() {
    try {
      mutation.mutate(subject.id, {
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
      title={`Delete ${subject.subjectName} subject`}
      description="Please note that this change is irreversible. This will delete this subject and all the associated data attached to it."
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
