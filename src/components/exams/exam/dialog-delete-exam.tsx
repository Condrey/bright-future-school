"use client";

import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { ExamData } from "@/lib/types";
import { useDeleteExamMutation } from "./mutation";

export interface DialogDeleteExamProps {
  exam: ExamData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DialogDeleteExam({
  exam,
  open,
  setOpen,
}: DialogDeleteExamProps) {
  const { isPending, mutate } = useDeleteExamMutation();

  return (
    <ResponsiveDrawer open={open} setOpen={setOpen} title="Delete Exam">
      <div className="p-4">
        <p>
          Are you sure you want to delete{" "}
          <span className="font-bold italic">"{exam.examName}"</span>
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={() => setOpen(false)} variant={"outline"}>
            Cancel
          </Button>
          <LoadingButton
            loading={isPending}
            variant={"destructive"}
            onClick={() =>
              mutate(
                { id: exam.id },
                {
                  onSuccess: () => setOpen(false),
                },
              )
            }
          >
            Delete
          </LoadingButton>
        </div>
      </div>
    </ResponsiveDrawer>
  );
}
