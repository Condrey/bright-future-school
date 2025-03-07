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
import { subjectSchema, SubjectSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Subject } from "@prisma/client";
import cuid from "cuid";
import { useForm } from "react-hook-form";
import { useAddSubjectMutation, useUpdateSubjectMutation } from "./mutation";

interface FormAddEditSubjectProps {
  subjectToEdit?: Subject;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditSubject({
  subjectToEdit,
  open,
  setOpen,
}: FormAddEditSubjectProps) {
  const addMutation = useAddSubjectMutation();
  const updateMutation = useUpdateSubjectMutation();
  const form = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    values: {
      subjectName: subjectToEdit?.subjectName || "",
      slug: subjectToEdit?.slug || "",
      id: subjectToEdit?.id || "",
    },
  });

  function handleSubmit(input: SubjectSchema) {
    if (!subjectToEdit) {
      addMutation.mutate(
        { ...input, id: cuid() },
        {
          onSuccess() {
            setOpen(false);
            form.reset();
          },
        },
      );
    } else {
      updateMutation.mutate(input, {
        onSuccess() {
          setOpen(false);
          form.reset();
        },
      });
    }
  }
  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={`${subjectToEdit ? "Update" : "Add"} subject`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
  
          <FormField
            control={form.control}
            name="subjectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Science" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /><FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short form</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Sci" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <div className="flex items-center justify-end">
            <LoadingButton
              loading={
                subjectToEdit ? updateMutation.isPending : addMutation.isPending
              }
            >
              {subjectToEdit ? "Update" : "Submit"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
