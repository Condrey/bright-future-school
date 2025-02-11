import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { yearSchema, YearSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcademicYear as Year } from "@prisma/client";
import cuid from "cuid";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useAddYearMutation, useUpdateYearMutation } from "./mutation";

interface FormAddEditYearProps {
  yearToEdit?: Year;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditYear({
  yearToEdit,
  open,
  setOpen,
}: FormAddEditYearProps) {
  const addMutation = useAddYearMutation();
  const updateMutation = useUpdateYearMutation();
  const form = useForm<YearSchema>({
    resolver: zodResolver(yearSchema),
    defaultValues: {
      year: yearToEdit?.year || "",
      id: yearToEdit?.id || "",
      startAt: yearToEdit?.startAt,
      endAt: yearToEdit?.endAt ?? new Date(),
    },
  });

  function handleSubmit(input: YearSchema) {
    if (!yearToEdit) {
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
      title={`${yearToEdit ? "Update" : "Add"} academic year`}
      className="lg:max-w-3xl"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>

                <FormControl>
                  <Input placeholder="e.g 2025" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col items-center gap-4">
            <FormLabel>Please choose the start and end date.</FormLabel>
            <div className="flex w-full flex-wrap justify-evenly gap-4">
              <FormField
                control={form.control}
                name="startAt"
                render={({ field }) => (
                  <FormItem>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      fixedWeeks
                      initialFocus={!yearToEdit}
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={Number(new Date().getFullYear) + 1}
                      footer={
                        <div className="w-full *:mx-auto">
                          {field.value ? (
                            <span>
                              From{" "}
                              <strong className="font-bold">
                                {format(field.value, "PPP")}
                              </strong>
                            </span>
                          ) : (
                            <span className="italic">Pick a starting date</span>
                          )}
                        </div>
                      }
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endAt"
                render={({ field }) => (
                  <FormItem>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      fixedWeeks
                      initialFocus={!yearToEdit}
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={Number(new Date().getFullYear) + 1}
                      footer={
                        <div className="w-full *:mx-auto">
                          {field.value ? (
                            <span>
                              To{" "}
                              <strong className="font-bold">
                                {format(field.value, "PPP")}
                              </strong>
                            </span>
                          ) : (
                            <span className="italic">Pick an ending date</span>
                          )}
                        </div>
                      }
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <LoadingButton
              loading={
                yearToEdit ? updateMutation.isPending : addMutation.isPending
              }
            >
              {yearToEdit ? "Update" : "Submit"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
