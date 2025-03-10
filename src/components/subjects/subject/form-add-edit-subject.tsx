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
import { SubjectData } from "@/lib/types";
import { GradingSchema, subjectSchema, SubjectSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import cuid from "cuid";
import { useForm } from "react-hook-form";
import FormAddEditSubjectGrading from "./form-add-edit-subject-grading";
import { useAddSubjectMutation, useUpdateSubjectMutation } from "./mutation";
import FormAddEditLevel from "./form-add-edit-level";

interface FormAddEditSubjectProps {
  subjectToEdit?: SubjectData;
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
      code: subjectToEdit?.code || "",
      levelId:subjectToEdit?.levelId||'',
      grading: (subjectToEdit?.grading || []) as GradingSchema[],
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
      title={`${subjectToEdit ? "Update" : "Add"} subjects`}
      className="md:max-w-3xl"
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
          />
          <FormField
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
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., 1110" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormAddEditLevel form={form}/>
          <FormAddEditSubjectGrading form={form} />
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
