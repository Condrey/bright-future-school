import LoadingButton from "@/components/loading-button";
import { ReactCalendar } from "@/components/react-calendar/react-calendar";
import ButtonAddNewSubject from "@/components/subjects/subject/button-add-new-subject";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ClassStreamData, ExamData } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  multipleExamSubjectSchema,
  MultipleExamSubjectSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  CheckIcon,
  LucideMoveRight,
  MoveLeftIcon,
  PlusIcon,
} from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { useUpdateExamSubjectsMutation } from "./mutation";
import ButtonUpdateExamSubjects from "./button-update-exam-subjects";
import ButtonAddViewSubjects from "@/components/subjects/form-add-view-subject/button-add-view-subjects";

interface FormAddEditExamSubjectProps {
  exam: ExamData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditExamSubject({
  exam,
  open,
  setOpen,
}: FormAddEditExamSubjectProps) {
  const academicYearSubjects =
    exam.classTerm.classStream?.class?.academicYearSubjects!;

    const [isDateMode, setIsDateMode] = useState(false);
  const form = useForm<MultipleExamSubjectSchema>({
    resolver: zodResolver(multipleExamSubjectSchema),
    defaultValues: { examSubjects: exam.examSubjects },
  });
  const { isPending, mutate } = useUpdateExamSubjectsMutation();
  function onSubmit(input: MultipleExamSubjectSchema) {
    mutate(
      { examId: exam.id, input },
      {
        onSuccess() {
          setOpen(false);
        },
      },
    );
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side={"top"} className="flex h-fit flex-col">
        <SheetHeader>
          <SheetTitle>Update exam Subjects</SheetTitle>
        </SheetHeader>
        <SheetDescription>
          {isDateMode
            ? "Provide Exam dates for the selected subjects"
            : "Please choose subjects from the list of subjects belonging to this stream"}
        </SheetDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex max-h-[65vh] flex-1 flex-col space-y-4 overflow-y-auto scroll-smooth">
              {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
              <pre>{JSON.stringify(form.watch(), null, 2)}</pre> */}
              {!isDateMode ? (
                <FormField
                  control={form.control}
                  name="examSubjects"
                  render={() => (
                    <FormItem>
                      {academicYearSubjects.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="examSubjects"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value
                                      ?.flatMap((v) => v.id)
                                      .includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            {
                                              ...item,
                                              academicYearSubjectId: item.id,
                                            },
                                          ])
                                        : field.onChange(
                                            field.value.filter(
                                              (val) => val.id !== item.id,
                                            ),
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal capitalize">
                                  {item.subject.code} {item.subject.subjectName}{" "}
                                  ({item.subject.slug})
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <SubjectsWithDates
                  form={form}
                  exam={exam}
                  isDateView={isDateMode}
                />
              )}
            </div>
            <SheetFooter>
              <div className="flex w-full items-center justify-end gap-4">
           <ButtonAddViewSubjects type="button" classStream={exam.classTerm.classStream as ClassStreamData}   >
            More subjects
           </ButtonAddViewSubjects>
                <Button
                  variant={isDateMode ? "destructive" : "default"}
                  type="button"
                  disabled={!form.watch("examSubjects").length}
                  onClick={() => setIsDateMode(!isDateMode)}
                >
                  {isDateMode && <MoveLeftIcon />}
                  {isDateMode ? "Re-select" : "Next"}
                  {!isDateMode && <LucideMoveRight />}
                </Button>
                {isDateMode && (
                  <LoadingButton type="submit" loading={isPending}>
                    Update <CheckIcon />
                  </LoadingButton>
                )}
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

interface SubjectsWithDatesProps {
  form: UseFormReturn<MultipleExamSubjectSchema>;
  exam: ExamData;
  isDateView: boolean;
}
function SubjectsWithDates({ form, exam, isDateView }: SubjectsWithDatesProps) {
  const { fields } = useFieldArray({
    control: form.control,
    name: "examSubjects",
  });
  const academicYearSubjects =
    exam.classTerm.classStream?.class?.academicYearSubjects!;
  return (
    <div className={cn("space-y-6", isDateView && "duration-300 animate-in")}>
      {fields.map((examSubject, number) => {
        const academicYearSubject = academicYearSubjects.find(
          (a) => a.id === examSubject.academicYearSubjectId,
        )?.subject;
        const subject = `${academicYearSubject?.code} ${academicYearSubject?.subjectName} (${academicYearSubject?.slug})`;
        return (
          <div
            key={examSubject.id}
            className="flex flex-col items-start gap-4 sm:flex-row sm:gap-3"
          >
            <span className="hidden h-6 w-6 flex-none items-center justify-center rounded-full bg-muted text-xs text-muted-foreground sm:flex">
              #{number + 1}
            </span>{" "}
            <FormField
              control={form.control}
              name={`examSubjects.${number}.academicYearSubjectId`}
              render={() => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-muted-foreground">
                    <span className="inline sm:hidden">{number + 1}.</span>{" "}
                    Subject selected
                  </FormLabel>
                  <Input value={subject} disabled />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`examSubjects.${number}.examDate`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of subject exam</FormLabel>{" "}
                  <ReactCalendar
                    selected={field.value}
                    onChange={field.onChange}
                    showTimeSelect
                    showIcon
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    timeCaption="time"
                    dateFormat="dd/MM/yyyy h:mm aa"
                    placeholderText="dd/MM/yyyy h:mm aa"
                    clearButtonTitle="Clear"
                    icon={<CalendarIcon />}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
