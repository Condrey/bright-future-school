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
import { teachingStaffSchema, TeachingStaffSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import cuid from "cuid";
import { useForm } from "react-hook-form";
import {
  useAddTeachingStaffMutation,
  useUpdateTeachingStaffMutation,
} from "./mutation";

interface FormAddEditTeachingStaffProps {
  teachingStaffToEdit?: StaffData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditTeachingStaff({
  teachingStaffToEdit,
  open,
  setOpen,
}: FormAddEditTeachingStaffProps) {
  const addMutation = useAddTeachingStaffMutation();
  const updateMutation = useUpdateTeachingStaffMutation();
  const form = useForm<TeachingStaffSchema>({
    resolver: zodResolver(teachingStaffSchema),
    values: {
      user: teachingStaffToEdit
        ? {
            email: teachingStaffToEdit.user?.email ?? undefined,
            id: teachingStaffToEdit.user?.id ?? "",
            name: teachingStaffToEdit.user?.name ?? "",
            telephone: teachingStaffToEdit.user?.telephone ?? "",
            username: teachingStaffToEdit.user?.username ?? "",
            role: teachingStaffToEdit.user?.role ?? Role.USER,
          }
        : {
            email: undefined,
            id: "",
            name: "",
            telephone: "",
            username: "",
            role: Role.USER,
          },
      id: teachingStaffToEdit?.id || "",
    },
  });

  function handleSubmit(input: TeachingStaffSchema) {
    if (!teachingStaffToEdit) {
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
      title={`${teachingStaffToEdit ? "Update" : "Add"} teachingStaff`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* <pre>{JSON.stringify(form.formState.errors,null,2)}</pre> */}
          <FormField
            control={form.control}
            name="user.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TeachingStaff name</FormLabel>

                <FormControl>
                  <Input placeholder="e.g First teachingStaff" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end">
            <LoadingButton
              loading={
                teachingStaffToEdit
                  ? updateMutation.isPending
                  : addMutation.isPending
              }
            >
              {teachingStaffToEdit ? "Update" : "Submit"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
