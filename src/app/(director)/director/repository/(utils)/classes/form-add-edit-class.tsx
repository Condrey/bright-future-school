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
import { ClassData } from "@/lib/types";
import { classSchema, ClassSchema, LevelSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import cuid from "cuid";
import { useForm } from "react-hook-form";
import Levels from "./(form)/levels";
import { useAddClassMutation, useUpdateClassMutation } from "./mutation";

interface FormAddEditClassProps {
  classToEdit?: ClassData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditClass({
  classToEdit,
  open,
  setOpen,
}: FormAddEditClassProps) {
  const addMutation = useAddClassMutation();
  const updateMutation = useUpdateClassMutation();
  const form = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
    values: {
      name: classToEdit?.name || "",
      id: classToEdit?.id || "",
      level: classToEdit?.level as LevelSchema,
    },
  });

  function handleSubmit(input: ClassSchema) {
    if (!classToEdit) {
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
      title={`${classToEdit ? "Update" : "Add"} class`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Form input fields  */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Primary one" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Area showing list of levels in check boxes to chose from  */}
          <FormField
            control={form.control}
            name="level"
            render={() => (
              <FormItem>
                <Levels form={form} />
              </FormItem>
            )}
          />

          {/* Action button for form submission  */}
          <div className="flex items-center justify-end">
            <LoadingButton
              loading={
                classToEdit ? updateMutation.isPending : addMutation.isPending
              }
            >
              {classToEdit ? "Update" : "Submit"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
