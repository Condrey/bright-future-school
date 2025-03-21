"use client";

import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ExamData } from "@/lib/types";
import { examSchema, ExamSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface FormAddEditExamProps {
  examToEdit?: ExamData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditExam({
  examToEdit,
  open,
  setOpen,
}: FormAddEditExamProps) {
  const form = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
    defaultValues: examToEdit,
  });

  function handleSubmit(input: ExamSchema) {}

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={`${examToEdit ? "Update" : "Add"} exams`}
      className="md:max-w-3xl"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="examName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Examination name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Beginning of term" />
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
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., assessment examinations"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end">
            <LoadingButton loading></LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
