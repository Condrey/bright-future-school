"use client";

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
import { PupilSchema, pupilSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAddUnregisteredPupil } from "../../mutation";

interface FormAddUnregisteredPupilProps {
  title?: string;
  description?: string;
  classStreamId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}
export default function FormAddUnregisteredPupil({
  title,
  description,
  classStreamId,
  open,
  setOpen,
}: FormAddUnregisteredPupilProps) {
  const mutation = useAddUnregisteredPupil();

  const form = useForm<PupilSchema>({
    resolver: zodResolver(pupilSchema),
    values: {
      id: "",
      user: { email: undefined, id: "", name: "", telephone: undefined, username: undefined },
    },
  });

  function handleFormSubmit(input: PupilSchema) {
    mutation.mutate(
      { input, classStreamId },
      {
        onSuccess() {
          setOpen(false);
          form.reset();
        },
      },
    );
  }

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={title || "Add new pupil."}
      description={description}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          {/* <pre>{JSON.stringify(form.formState.errors,null,2)}</pre> */}
          <FormField
            control={form.control}
            name="user.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pupil/ student name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter name of student/ pupil..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end">
            <LoadingButton loading={mutation.isPending}>Submit</LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
