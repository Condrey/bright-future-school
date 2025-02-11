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
import { streamSchema, StreamSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stream } from "@prisma/client";
import cuid from "cuid";
import { useForm } from "react-hook-form";
import { useAddStreamMutation, useUpdateStreamMutation } from "./mutation";

interface FormAddEditStreamProps {
  streamToEdit?: Stream;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditStream({
  streamToEdit,
  open,
  setOpen,
}: FormAddEditStreamProps) {
  const addMutation = useAddStreamMutation();
  const updateMutation = useUpdateStreamMutation();
  const form = useForm<StreamSchema>({
    resolver: zodResolver(streamSchema),
    values: {
      name: streamToEdit?.name || "",
      id: streamToEdit?.id || "",
    },
  });

  function handleSubmit(input: StreamSchema) {
    if (!streamToEdit) {
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
      title={`${streamToEdit ? "Update" : "Add"} stream`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stream name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Cambridge" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end">
            <LoadingButton
              loading={
                streamToEdit ? updateMutation.isPending : addMutation.isPending
              }
            >
              {streamToEdit ? "Update" : "Submit"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
