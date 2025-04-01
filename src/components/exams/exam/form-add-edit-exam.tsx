"use client";

import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allExamTypes, examTypes } from "@/lib/enums";
import { ExamData } from "@/lib/types";
import { examSchema, ExamSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExamType } from "@prisma/client";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import {
  useUpsertExamMutation,
  useUpsertExamWholeClassMutation,
} from "./mutation";

interface FormAddEditExamProps {
  examToEdit?: ExamData;
  classTermId?: string;
  academicYearClassId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditExam({
  examToEdit,
  classTermId,
  academicYearClassId,
  open,
  setOpen,
}: FormAddEditExamProps) {
  const form = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      classTermId: examToEdit?.classTermId || classTermId || "",
      examDate: examToEdit?.examDate || new Date(),
      examName: examToEdit?.examName || "",
      examType: examToEdit?.examType || ExamType.EXAM,
      id: examToEdit?.id || "",
    },
  });
  const mutation = useUpsertExamMutation();
  const mutationWholeClass = useUpsertExamWholeClassMutation();

  function handleSubmit(formData: ExamSchema) {
    mutation.mutate(
      { formData },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  }
  function handleSubmitWholeClass(formData: ExamSchema) {
    mutationWholeClass.mutate(
      { formData, academicYearClassId },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  }

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={`${examToEdit ? "Update" : "Add"} exams`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
          {/* <pre>{JSON.stringify(form.watch(), null, 2)}</pre> */}
          <FormField
            control={form.control}
            name="examName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Examination name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Beginning of term or BOT"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="examType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Examination Type</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an exam type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Types of exams available</SelectLabel>
                      {allExamTypes.map((examType) => (
                        <SelectItem value={examType} key={examType}>
                          {examTypes[examType]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="examDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exam date</FormLabel>
                <FormControl>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("1900-01-01")}
                    // initialFocus={field.value||new Date()}
                    captionLayout="buttons"
                    fixedWeeks
                    fromYear={1900}
                    toYear={Number(new Date().getFullYear) + 1}
                    footer={
                      <div className="w-full *:mx-auto">
                        {field.value ? (
                          <span>
                            Chosen{" "}
                            <strong className="font-bold">
                              {format(field.value, "PPP")}
                            </strong>
                          </span>
                        ) : (
                          <span className="italic text-muted-foreground">
                            Choose the exam date from the calendar
                          </span>
                        )}
                      </div>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end">
            {examToEdit ? (
              <LoadingButton
                loading={mutationWholeClass.isPending || mutation.isPending}
              >
                Update exam
              </LoadingButton>
            ) : (
              <div className="flex items-center">
                <LoadingButton
                  loading={mutationWholeClass.isPending || mutation.isPending}
                  className="rounded-e-none"
                  title="Create for this stream only"
                >
                  Add exam
                </LoadingButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size={"icon"}
                      className="rounded-s-none"
                      title="More actions"
                    >
                      <CaretDownIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          type="button"
                          onClick={() =>
                            form.handleSubmit(handleSubmitWholeClass)()
                          }
                        >
                          Create for the whole class
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Button variant={"ghost"} size={"sm"} type="submit">
                          Create for this stream only
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
