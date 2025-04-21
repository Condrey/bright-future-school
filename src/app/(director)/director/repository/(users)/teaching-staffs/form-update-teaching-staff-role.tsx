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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allTeachingStaffCategories, userRoles } from "@/lib/enums";
import { StaffData } from "@/lib/types";
import { teachingStaffSchema, TeachingStaffSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useUpdateTeachingStaffMutation } from "../../../../../../components/users/staff/mutation";

interface FormUpdateTeachingStaffRoleProps {
  teachingStaff: StaffData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormUpdateTeachingStaffRole({
  teachingStaff,
  open,
  setOpen,
}: FormUpdateTeachingStaffRoleProps) {
  const updateMutation = useUpdateTeachingStaffMutation();
  const form = useForm<TeachingStaffSchema>({
    resolver: zodResolver(teachingStaffSchema),
    values: {
      user: teachingStaff
        ? {
            email: teachingStaff.user?.email ?? undefined,
            id: teachingStaff.user?.id ?? "",
            name: teachingStaff.user?.name ?? "",
            telephone: teachingStaff.user?.telephone ?? "",
            username: teachingStaff.user?.username ?? "",
            role: teachingStaff.user?.role ?? Role.USER,
          }
        : {
            email: undefined,
            id: "",
            name: "",
            telephone: "",
            username: "",
            role: Role.USER,
          },
      id: teachingStaff?.id || "",
    },
  });

  function handleSubmit(input: TeachingStaffSchema) {
    updateMutation.mutate(input, {
      onSuccess() {
        setOpen(false);
        form.reset();
      },
    });
  }
  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title="Change staff role"
      description={`Update ${teachingStaff.user?.name}'s role`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="user.role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allTeachingStaffCategories.map((value) => {
                      const { label, icon } = userRoles[value];
                      const Icon = icon;
                      return (
                        <SelectItem key={value} value={value}>
                          <div className="flex flex-row items-center">
                            <Icon className="mr-2 size-4" />
                            <span>{label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end">
            <LoadingButton loading={updateMutation.isPending}>
              Update
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
