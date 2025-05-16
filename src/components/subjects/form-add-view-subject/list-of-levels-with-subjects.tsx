import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AcademicYearSubjectSchema,
  multipleAcademicYearSubjectSchema,
  MultipleAcademicYearSubjectSchema,
} from "@/lib/validation";

import LoadingButton from "@/components/loading-button";
import ButtonAddNewSubject from "@/components/subjects/subject/button-add-new-subject";
import { Checkbox } from "@/components/ui/checkbox";
import { SheetFooter } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { AcademicYearSubjectData, LevelData } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { useUpsertAcademicYearClassMutation } from "../../../app/(director)/director/management/report-card-management/(tables)/(subjects)/mutation";
import cuid from "cuid";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { setSourceMapsEnabled } from "process";

interface ListOfSubjectsProps {
  levels: LevelData[];
  academicYearClassId: string;
  academicYearSubjects: AcademicYearSubjectData[] | undefined;
  setOpen: (open: boolean) => void;
}
export default function ListOfLevelsWithSubjects({
  levels,
  academicYearClassId,
  academicYearSubjects,
  setOpen,
}: ListOfSubjectsProps) {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const form = useForm<MultipleAcademicYearSubjectSchema>({
    resolver: zodResolver(multipleAcademicYearSubjectSchema),
    values: {
      academicYearSubjects: academicYearSubjects!,
    },
  });
  const mutation = useUpsertAcademicYearClassMutation();
  function handleSubmit(input: MultipleAcademicYearSubjectSchema) {
    mutation.mutate(
      { input, academicYearClassId },
      {
        onSuccess: () => {
          setOpenConfirmDialog(false);
          setOpen(false);
          toast({ description: "Subjects updated successfully" });
        },
      },
    );
  }

  return (
    <>
      <div className="space-y-4">
        {levels.map((level) => {
          return (
            <div className="space-y-2" key={level.id}>
              <h2 className="text-lg font-semibold">{level.name} level</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <FormField
                    control={form.control}
                    name="academicYearSubjects"
                    render={() => (
                      <FormItem>
                        {level.subjects.map((subject, index) => (
                          <FormField
                            key={subject.id}
                            control={form.control}
                            name={"academicYearSubjects"}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value
                                      .flatMap((f) => f.subject.id)
                                      .includes(subject.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            {
                                              subject,
                                              id:
                                                academicYearSubjects?.find(
                                                  (a) =>
                                                    a.subjectId === subject.id,
                                                )?.id || cuid(),
                                            },
                                          ] satisfies AcademicYearSubjectSchema[])
                                        : field.onChange(
                                            field.value.filter(
                                              (d) =>
                                                d.subject.id !== subject.id,
                                            ),
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {subject.subjectName}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          );
        })}
      </div>
      <hr className="my-4" />
      <SheetFooter className="sticky bottom-0 flex flex-row items-center gap-2">
        <ButtonAddNewSubject
          variant={"outline"}
          size={"default"}
          disabled={mutation.isPending}
        >
          <PlusIcon className="size-4" />
          <span>Subject</span>
        </ButtonAddNewSubject>
        <Button
          type="button"
          variant={"default"}
          disabled={!form.formState.isDirty}
          onClick={() => setOpenConfirmDialog(true)}
        >
          Update
        </Button>
      </SheetFooter>
      <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <TriangleAlert className="inline" /> Attention
            </DialogTitle>
            <DialogDescription>
              Dangerous action, continue with caution
            </DialogDescription>
          </DialogHeader>
          <p>
            Please note that <strong>unchecking</strong> the already
            existing(checked) subjects means deleting them. When they are
            deleted, all the <strong>exams</strong> under them together with the{" "}
            <strong>pupils/ students' exam scores</strong> shall be deleted as
            well.
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant={"outline"}
              onClick={() => setOpenConfirmDialog(false)}
            >
              Go back
            </Button>
            <LoadingButton
              type="submit"
              variant={"destructive"}
              size={"default"}
              loading={mutation.isPending}
              onClick={() => form.handleSubmit(handleSubmit)()}
            >
              Continue
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
