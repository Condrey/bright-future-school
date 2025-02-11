"use client";

import { NumberInput } from "@/components/number-input/number-input";
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
import { countryCurrency } from "@/lib/utils";
import { classTermSchema, ClassTermSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassTerm } from "@prisma/client";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import ButtonsClassTermUpdate from "./buttons-class-term-update";
import { useUpdateSingleTermMutation } from "./mutation";

interface EditTermFormProps {
  termToEdit: ClassTerm;
  academicYearClassId: string;
  levelId: string;
  termId: string;
  academicYear: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function EditTermForm({
  termToEdit,
  academicYear,
  academicYearClassId,
  levelId,
  termId,
  open,
  setOpen,
}: EditTermFormProps) {
  const mutation = useUpdateSingleTermMutation();

  const form = useForm<ClassTermSchema>({
    resolver: zodResolver(classTermSchema),
    values: {
      id: termToEdit.id,
      feesAmount: termToEdit.feesAmount!,
      endAt: termToEdit.endAt,
      startAt: termToEdit.startAt,
    },
  });
  function handleSubmit(input: ClassTermSchema) {
    mutation.mutate(input, {
      onSuccess() {
        setOpen(false);
      },
    });
  }
  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title="Edit this term"
      className="md:max-w-3xl"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="feesAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fees Amount</FormLabel>

                <FormControl>
                  <NumberInput
                    placeholder="e.g., 450000"
                    {...field}
                    suffix={countryCurrency}
                  />
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
            <ButtonsClassTermUpdate
              form={form}
              setOpen={setOpen}
              academicYear={academicYear}
              academicYearClassId={academicYearClassId}
              levelId={levelId}
              termId={termId}
            />
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
