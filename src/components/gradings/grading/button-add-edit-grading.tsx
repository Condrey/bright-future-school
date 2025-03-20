'use client'

import LoadingButton from "@/components/loading-button";
import { NumberInput } from "@/components/number-input/number-input";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { gradingSchema, GradingSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grading } from "@prisma/client";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpsertGradingMutation } from "./mutation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ButtonAddEditGradingProps {
  gradingToEdit?: Grading;
  disPlayAsIcon?: boolean;
}

export default function ButtonAddEditGrading({
  gradingToEdit,
  disPlayAsIcon = false,
}: ButtonAddEditGradingProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<GradingSchema>({
    resolver: zodResolver(gradingSchema),
    values: {
      id: gradingToEdit?.id || "",
      from: gradingToEdit?.from || 0,
      to: gradingToEdit?.to || 0,
      grade: gradingToEdit?.grade || "",
      remarks: gradingToEdit?.remarks || "",
    },
  });
  const { mutate, isPending } = useUpsertGradingMutation();
  function onSubmit(input: GradingSchema) {
    mutate(input, { onSuccess: () => setOpen(false) });
  }
  return (
    <>
      <Button
        title={gradingToEdit ? "Edit grading" : "Add grading"}
        size={disPlayAsIcon ? "icon" : "default"}
        variant={
          disPlayAsIcon ? "outline" : gradingToEdit ? "secondary" : "default"
        }
        className={cn(disPlayAsIcon&&'rounded-full')}
        onClick={() => setOpen(true)}
      >
        {disPlayAsIcon ? "" : gradingToEdit ? "Edit grading" : "Add Grading"}
        {disPlayAsIcon && (
          <>
            {gradingToEdit ? (
              <PencilIcon className="size-4" />
            ) : (
              <PlusIcon className="size-4" />
            )}
          </>
        )}
      </Button>
      <ResponsiveDrawer
        open={open}
        setOpen={setOpen}
        title={gradingToEdit ? "Edit grading" : "Add grading"}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <FormControl>
                    <NumberInput placeholder="e.g., 0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <NumberInput placeholder="e.g., 49" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., F" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Failed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-4">
              <LoadingButton loading={isPending}>
                {gradingToEdit ? "Update" : "Submit"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </ResponsiveDrawer>
    </>
  );
}
