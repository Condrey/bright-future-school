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
import { assetCaretakerCategories, userRoles } from "@/lib/enums";
import { StaffData } from "@/lib/types";
import {
  nonTeachingStaffSchema,
  NonTeachingStaffSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useUpdateNonTeachingStaffMutation } from "./mutation";

interface FormUpdateNonTeachingStaffRoleProps {
  nonTeachingStaff: StaffData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormUpdateNonTeachingStaffRole({
  nonTeachingStaff,
  open,
  setOpen,
}: FormUpdateNonTeachingStaffRoleProps) {
  const updateMutation = useUpdateNonTeachingStaffMutation();
  const form = useForm<NonTeachingStaffSchema>({
    resolver: zodResolver(nonTeachingStaffSchema),
    values: {
      user: nonTeachingStaff
        ? {
            email: nonTeachingStaff.user?.email || undefined,
            id: nonTeachingStaff.user?.id ?? "",
            name: nonTeachingStaff.user?.name ?? "",
            telephone: nonTeachingStaff.user?.telephone ?? "",
            username: nonTeachingStaff.user?.username ?? "",
            role: nonTeachingStaff.user?.role ?? Role.USER,
          }
        : {
            email: undefined,
            id: "",
            name: "",
            telephone: "",
            username: "",
            role: Role.USER,
          },
      id: nonTeachingStaff?.id || "",
    },
  });

  function handleSubmit(input: NonTeachingStaffSchema) {
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
      title="Change non teaching staff role"
      description={`Update ${nonTeachingStaff.user?.name}'s role`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* <pre>{JSON.stringify(form.getValues(), null, 2)}</pre> */}
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
                    {assetCaretakerCategories.map((value) => {
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
