"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { GradingSchema, SubjectSchema } from "@/lib/validation";
import { Grading } from "@prisma/client";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import GradingContainer from "../../gradings/grading/grading-container";

interface SubjectGradingsProps {
  allGrading: Grading[];
  form: UseFormReturn<SubjectSchema>;
}

export default function SubjectGradings({
  allGrading,
  form,
}: SubjectGradingsProps) {
  const { remove, append } = useFieldArray({
    control: form.control,
    name: "grading",
  });
  const subjectGradingS = form.watch("grading");

  return (
    <div>
      <div className="flex items-center gap-3">
        <Checkbox
          onCheckedChange={(value) => {
            if (value) {
              append(
                allGrading.filter((g) =>
                  subjectGradingS.every((s) => s.id !== g.id),
                ) as GradingSchema[],
              );
            }
          }}
          checked={subjectGradingS.length >= allGrading.length}
          disabled={subjectGradingS.length >= allGrading.length}
          id="select-all-gradings"
        />
        <Label htmlFor="select-all-gradings">Select all default gradings</Label>
      </div>
      {/* <pre className="text-destructive">
        {JSON.stringify(subjectGradingS, null, 2)}
      </pre>
      <pre>{JSON.stringify(allGrading, null, 2)}</pre> */}
      <hr className="my-1" />
      <FormField
        control={form.control}
        name="grading"
        render={() => (
          <FormItem>
            {[
              ...(allGrading as GradingSchema[]).filter(
                (g) => !subjectGradingS.some((s) => s.id === g.id),
              ),
              ...subjectGradingS,
            ]
              .toSorted((a, b) => a.from - b.from)
              .map((grading, index) => (
                <FormField
                  key={grading.id}
                  control={form.control}
                  name="grading"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={grading.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value
                              .flatMap((f) => f.id)
                              .includes(grading.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, grading])
                                : field.onChange(
                                    field.value.filter(
                                      (d) => d.id !== grading.id,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel>
                          <GradingContainer grading={grading as Grading} />
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
