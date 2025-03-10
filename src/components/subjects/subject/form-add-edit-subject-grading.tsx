import { NumberInput } from "@/components/number-input/number-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";

interface FormAddEditSubjectGradingProps {
  form: UseFormReturn<SubjectSchema>;
}

export default function FormAddEditSubjectGrading({
  form,
}: FormAddEditSubjectGradingProps) {
  const [open, setOpen] = useState(false);
  const { remove } = useFieldArray({
    control: form.control,
    name: "grading",
  });
  const subjectGradingS = form.watch("grading");

  return (
    <div className="space-y-2">
      <FormLabel>Default grading</FormLabel>
      {!!subjectGradingS.length && <hr />}
      <div className="flex flex-col gap-1">
        {subjectGradingS.map((grading, index) => (
          <div key={grading.id} className="flex items-center gap-3">
            <Checkbox
              defaultChecked
              onCheckedChange={(value) => {
                if (!value) {
                  remove(index);
                }
              }}
              title='Remove this grading from the list'/>
            <div className="line-clamp-1 grid flex-1  grid-cols-2  gap-1">
              <span>
                {grading.from} - {grading.to}
              </span>
              <p >
                (<span className="font-bold">{grading.grade}</span>,{" "}
                <span className="italic">{grading.remarks}</span>)
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-full">
        {open ? (
          <Grading form={form} setOpen={setOpen} />
        ) : (
          <Button
            className={cn(" w-full max-w-fit",!!subjectGradingS.length &&'mt-2')}
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
                <NumberInput
                  placeholder="e.g to 0"
                  {...field}
                />
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
          onClick={() => form2.handleSubmit(handleSubmit)()}
        >
          <CheckIcon className="size-4" />
        </Button>
      </div>

    </>
     </Form>
  );
}
