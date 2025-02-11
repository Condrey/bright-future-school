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
import { termSchema, TermSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Term } from "@prisma/client";
import cuid from "cuid";
import { useForm } from "react-hook-form";
import { useAddTermMutation, useUpdateTermMutation } from "./mutation";

interface FormAddEditTermProps {
  termToEdit?: Term;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditTerm({
  termToEdit,
  open,
  setOpen,
}: FormAddEditTermProps) {
  const addMutation = useAddTermMutation();
  const updateMutation = useUpdateTermMutation();
  const form = useForm<TermSchema>({
    resolver: zodResolver(termSchema),
    values: {
      term: termToEdit?.term || "",
      id: termToEdit?.id || "",
    },
  });

  function handleSubmit(input: TermSchema) {
    if (!termToEdit) {
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
      title={`${termToEdit ? "Update" : "Add"} term`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="term"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Term name</FormLabel>

                <FormControl>
                  <Input placeholder="e.g First term" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end">
            <LoadingButton
              loading={
                termToEdit ? updateMutation.isPending : addMutation.isPending
              }
            >
              {termToEdit ? "Update" : "Submit"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
