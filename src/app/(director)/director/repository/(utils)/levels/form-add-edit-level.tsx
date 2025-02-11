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
import { levelSchema, LevelSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Level } from "@prisma/client";
import cuid from "cuid";
import { useForm } from "react-hook-form";
import { useAddLevelMutation, useUpdateLevelMutation } from "./mutation";

interface FormAddEditLevelProps {
  levelToEdit?: Level;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditLevel({
  levelToEdit,
  open,
  setOpen,
}: FormAddEditLevelProps) {
  const addMutation = useAddLevelMutation();
  const updateMutation = useUpdateLevelMutation();
  const form = useForm<LevelSchema>({
    resolver: zodResolver(levelSchema),
    values: {
      name: levelToEdit?.name || "",
      id: levelToEdit?.id || "",
    },
  });

  function handleSubmit(input: LevelSchema) {
    if (!levelToEdit) {
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
      title={`${levelToEdit ? "Update" : "Add"} level`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level name</FormLabel>
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
                levelToEdit ? updateMutation.isPending : addMutation.isPending
              }
            >
              {levelToEdit ? "Update" : "Submit"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
