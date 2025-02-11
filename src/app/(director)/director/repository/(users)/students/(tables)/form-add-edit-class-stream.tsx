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
import { ClassStreamData } from "@/lib/types";
import { classStreamSchema, ClassStreamSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import cuid from "cuid";
import { useForm } from "react-hook-form";
import {
  useAddClassStreamMutation,
  useUpdateClassStreamMutation,
} from "./mutation";

interface FormAddEditClassStreamProps {
  classStreamToEdit?: ClassStreamData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditClassStream({
  classStreamToEdit,
  open,
  setOpen,
}: FormAddEditClassStreamProps) {
  const addMutation = useAddClassStreamMutation();
  const updateMutation = useUpdateClassStreamMutation();
  const form = useForm<ClassStreamSchema>({
    resolver: zodResolver(classStreamSchema),
    values: {
      classId: classStreamToEdit?.classId || "",
      streamId: classStreamToEdit?.streamId || "",
      staffId: classStreamToEdit?.staffId || "",
      id: classStreamToEdit?.id || "",
    },
  });

  function handleSubmit(input: ClassStreamSchema) {
    if (!classStreamToEdit) {
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
      title={`${classStreamToEdit ? "Update" : "Add"} classStream`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* TODO: implement adding class */}
          <FormField
            control={form.control}
            name="classId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ClassStream name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Kindergarten" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end">
            <LoadingButton
              loading={
                classStreamToEdit
                  ? updateMutation.isPending
                  : addMutation.isPending
              }
            >
              {classStreamToEdit ? "Update" : "Submit"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
