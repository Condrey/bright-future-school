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
import { StaffData } from "@/lib/types";
import {
  nonTeachingStaffSchema,
  NonTeachingStaffSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import cuid from "cuid";
import { useForm } from "react-hook-form";
import {
  useAddNonTeachingStaffMutation,
  useUpdateNonTeachingStaffMutation,
} from "./mutation";

interface FormAddEditNonTeachingStaffProps {
  nonTeachingStaffToEdit?: StaffData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditNonTeachingStaff({
  nonTeachingStaffToEdit,
  open,
  setOpen,
}: FormAddEditNonTeachingStaffProps) {
  const addMutation = useAddNonTeachingStaffMutation();
  const updateMutation = useUpdateNonTeachingStaffMutation();
  const form = useForm<NonTeachingStaffSchema>({
    resolver: zodResolver(nonTeachingStaffSchema),
    values: {
      user: nonTeachingStaffToEdit
        ? {
            email: nonTeachingStaffToEdit.user?.email ?? "",
            id: nonTeachingStaffToEdit.user?.id ?? "",
            name: nonTeachingStaffToEdit.user?.name ?? "",
            telephone: nonTeachingStaffToEdit.user?.telephone ?? "",
            username: nonTeachingStaffToEdit.user?.username ?? "",
          }
        : { email: "", id: "", name: "", telephone: "", username: "" },
      id: nonTeachingStaffToEdit?.id || "",
    },
  });

  function handleSubmit(input: NonTeachingStaffSchema) {
    if (!nonTeachingStaffToEdit) {
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
      title={`${nonTeachingStaffToEdit ? "Update" : "Add"} nonTeachingStaff`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="user.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NonTeachingStaff name</FormLabel>

                <FormControl>
                  <Input placeholder="e.g First nonTeachingStaff" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end">
            <LoadingButton
              loading={
                nonTeachingStaffToEdit
                  ? updateMutation.isPending
                  : addMutation.isPending
              }
            >
              {nonTeachingStaffToEdit ? "Update" : "Submit"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
