"use client";

import LoadingButton from "@/components/loading-button";
import { NumberInput } from "@/components/number-input/number-input";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { TermWithYearData } from "@/lib/types";
import { classTermSchema, ClassTermSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassTerm } from "@prisma/client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import updateClassTerm from "./action";

interface EditTermFormProps {
  termToEdit: ClassTerm;
}

export default function EditTermForm({ termToEdit }: EditTermFormProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateClassTerm,
    async onSuccess(updatedClassTerm) {
      // term year streams
      const queryKey: QueryKey = ["year-term-streams"];
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<TermWithYearData[]>(
        queryKey,
        (oldData) =>
          oldData &&
          oldData.map((d) =>
            d.id === updatedClassTerm.id ? updatedClassTerm : d,
          ),
      );
      // Class term details
      await queryClient.setQueryData<TermWithYearData>(
        ["class-term", updatedClassTerm.id],
        (_) => updatedClassTerm,
      );
      //Pupils class stream
      queryClient.invalidateQueries({ queryKey: ["pupils", "classStream"] });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to update term, please try again.!",
        variant: "destructive",
      });
    },
  });
  const form = useForm<ClassTermSchema>({
    resolver: zodResolver(classTermSchema),
    defaultValues: {
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
    <>
      <Button className="w-fit" onClick={() => setOpen(true)}>
        Edit term
      </Button>
      <ResponsiveDrawer
        open={open}
        setOpen={setOpen}
        title="Edit this term"
        className="lg:max-w-3xl"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
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
                      suffix="UGX"
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
                              <span className="italic">
                                Pick a starting date
                              </span>
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
                              <span className="italic">
                                Pick an ending date
                              </span>
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
              <LoadingButton loading={mutation.isPending}>
                Submit{" "}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </ResponsiveDrawer>
    </>
  );
}
