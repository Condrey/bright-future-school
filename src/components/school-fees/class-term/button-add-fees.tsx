"use client ";

import LoadingButton from "@/components/loading-button";
import { NumberInput } from "@/components/number-input/number-input";
import ResponsiveDrawer from "@/components/responsive-drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { PupilData } from "@/lib/types";
import { cn, countryCurrency, formatCurrency, formatNumber } from "@/lib/utils";
import { feesSchema, FeesSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { addFees } from "./action";

interface ButtonAddFeesProps {
  classTermId: string;
  pupil: PupilData;
}

export default function ButtonAddFees({
  classTermId,
  pupil,
}: ButtonAddFeesProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<FeesSchema>({
    resolver: zodResolver(feesSchema),
    values: {
      termId: classTermId,
      pupilId: pupil.id,
      feesPayment: {},
    },
  });

  const previousPayments = pupil.fees.flatMap((f) => f.feesPayments);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addFees,
    async onSuccess() {
      // For list of pupils belonging to a class term
      const queryKey: QueryKey = ["pupils", "classStream", pupil.classStreamId];
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      // for class term
      queryClient.invalidateQueries({ queryKey: ["class-term", classTermId] });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Error adding fees payment.",
        variant: "destructive",
      });
    },
  });

  function handleSubmit(input: FeesSchema) {
    mutation.mutate(input, {
      onSuccess() {
        setOpen(false);
      },
    });
  }

  return (
    <>
      <LoadingButton
        loading={false}
        title="Add a fees payment"
        variant="outline"
        className="flex w-full max-w-fit items-center justify-between"
        onClick={() => setOpen(true)}
      >
        <span>+ Pay fees</span>
      </LoadingButton>
      <ResponsiveDrawer
        open={open}
        setOpen={setOpen}
        title={`Add fees for ${pupil.user?.name}`}
        description={`${pupil.classStream?.class?.academicYear?.year} ${pupil.classStream?.class?.class?.name} class, ${pupil.classStream?.stream?.name} stream`}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="feesPayment.amountPaid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fees Amount</FormLabel>
                    <FormControl>
                      <NumberInput
                        placeholder="amount received..."
                        suffix={countryCurrency}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end">
                <LoadingButton loading={mutation.isPending}>
                  Submit
                </LoadingButton>
              </div>
            </div>
            {!!previousPayments.length ? (
              <div className="space-y-1">
                <h1 className="font-bold">
                  Previous payments{" "}
                  <span className="text-muted-foreground">
                    ({formatNumber(previousPayments.length)})
                  </span>
                </h1>
                <div className="space-y-0.5">
                  <div>
                    {previousPayments.map((payment, index) => (
                      <div key={payment.id} className="flex w-full">
                        <div className="flex w-full items-center gap-3">
                          <span className="font-mono">
                            {formatCurrency(payment.amountPaid)}
                          </span>
                          <hr className="flex flex-1" />
                          <span>
                            {payment.updatedAt > payment.createdAt
                              ? `(Updated) ${format(payment.createdAt, "PPPP")}`
                              : format(payment.createdAt, "PPPP")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <hr className="my-2" />
                  <span className="font-mono">
                    Total Amount{" "}
                    {formatCurrency(
                      previousPayments.reduce(
                        (total, amount) =>
                          (total || 0) + (amount.amountPaid || 0),
                        0,
                      ) || 0,
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <span
                className={cn(
                  "block w-full text-center text-muted-foreground",
                  !form.formState.isDirty ? "visible" : "invisible",
                )}
              >
                There are no previous payments.
              </span>
            )}
          </form>
        </Form>
      </ResponsiveDrawer>
    </>
  );
}
