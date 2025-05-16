import { useGetAllGrading } from "@/components/gradings/grading/hooks";
import { NumberInput } from "@/components/number-input/number-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { gradingSchema, GradingSchema, SubjectSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import cuid from "cuid";
import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import SubjectGradings from "./subject-gradings";

interface FormAddEditSubjectGradingProps {
  form: UseFormReturn<SubjectSchema>;
}

export default function FormAddEditSubjectGrading({
  form,
}: FormAddEditSubjectGradingProps) {
  const [open, setOpen] = useState(false);
  const { remove, append } = useFieldArray({
    control: form.control,
    name: "grading",
  });
  const subjectGradingS = form.watch("grading");
  const { data, status, error, refetch, isFetching } = useGetAllGrading();
  if (status === "error") {
    console.error(error);
  }

  return (
    <div className="flex flex-col gap-2">
      <FormLabel>Subject grading</FormLabel>
      {!!subjectGradingS.length && <hr />}

      <div className="w-full space-y-3">
        <div>
          {status === "error" ? null : status === "pending" ? (
            <div className="flex items-center gap-2">
              <Loader2Icon className="size-4 animate-spin" />
              <span className="text-muted-foreground">
                Fetching default grading ...
              </span>
            </div>
          ) : status === "success" && !data.length ? (
            <span className="text-muted-foreground w-full max-w-sm text-center">
              There are no custom grading added in the system yet. Please add.
            </span>
          ) : (
            <SubjectGradings allGrading={data} form={form} />
          )}
        </div>

        {open ? (
          <Grading form={form} setOpen={setOpen} />
        ) : (
          <Button
            className={cn(
              "w-full max-w-fit",
              !!subjectGradingS.length && "mt-2",
            )}
            type="button"
            variant={"secondary"}
            onClick={() => setOpen(true)}
          >
            + Add new grading
          </Button>
        )}
      </div>
    </div>
  );
}

interface GradingProps {
  form: UseFormReturn<SubjectSchema>;
  setOpen: (open: boolean) => void;
}
function Grading({ form, setOpen }: GradingProps) {
  const { append } = useFieldArray({
    control: form.control,
    name: "grading",
  });

  const form2 = useForm<GradingSchema>({
    resolver: zodResolver(gradingSchema),
    defaultValues: {
      from: 10,
      to: 0,
      grade: "",
      remarks: "",
      id: cuid(),
    },
  });

  function handleSubmit(input: GradingSchema) {
    append({ ...input, id: cuid() });
    setOpen(false);
  }

  return (
    <Form {...form2}>
      <>
        <div className="flex items-end justify-evenly space-x-2 rounded-md border p-4">
          <FormField
            control={form2.control}
            name="from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From</FormLabel>
                <FormControl>
                  <NumberInput {...field} placeholder="e.g from 0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form2.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <FormControl>
                  <NumberInput placeholder="e.g to 0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form2.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade</FormLabel>
                <FormControl>
                  <Input placeholder="e.g F" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form2.control}
            name="remarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g Failed" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            size={"icon"}
            type="button"
            className="flex-none"
            variant={"destructive"}
            onClick={() => setOpen(false)}
          >
            <XIcon className="size-4" />
          </Button>
          <Button
            size={"icon"}
            type="button"
            className="flex-none"
            onClick={() => form2.handleSubmit(handleSubmit)()}
          >
            <CheckIcon className="size-4" />
          </Button>
        </div>
      </>
    </Form>
  );
}
