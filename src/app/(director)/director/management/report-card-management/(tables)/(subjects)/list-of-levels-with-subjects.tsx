import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  multipleSubjectSchema,
  MultipleSubjectSchema,
  SubjectSchema,
} from "@/lib/validation";

import LoadingButton from "@/components/loading-button";
import { Checkbox } from "@/components/ui/checkbox";
import { SheetFooter } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { LevelData } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Subject } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useUpsertAcademicYearClassMutation } from "./mutation";

interface ListOfSubjectsProps {
  levels: LevelData[];
  academicYearClassId: string;
  subjects: Subject[] | undefined;
}
export default function ListOfLevelsWithSubjects({
  levels,
  academicYearClassId,
  subjects,
}: ListOfSubjectsProps) {
  const form = useForm<MultipleSubjectSchema>({
    resolver: zodResolver(multipleSubjectSchema),
    values: {
      subjects: subjects as SubjectSchema[],
    },
  });
  const mutation = useUpsertAcademicYearClassMutation();
  function handleSubmit(input: MultipleSubjectSchema) {
    mutation.mutate(
      { input, academicYearClassId },
      {
        onSuccess: () =>
          toast({ description: "Subjects updated successfully" }),
      },
    );
  }

  return (
    <>
      {levels.map((level) => (
        <div className="space-y-2" key={level.id}>
          <h2 className="text-lg font-semibold">{level.name} level</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
              <FormField
                control={form.control}
                name="subjects"
                render={() => (
                  <FormItem>
                    {level.subjects.map((subject, index) => (
                      <FormField
                        key={subject.id}
                        control={form.control}
                        name={"subjects"}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value
                                  .flatMap((f) => f.id)
                                  .includes(subject.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, subject])
                                    : field.onChange(
                                        field.value.filter(
                                          (d) => d.id !== subject.id,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {subject.subjectName}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      ))}
      <pre className="text-destructive">
        {JSON.stringify({ academicYearClassId }, null, 2)}
      </pre>
      <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
      <SheetFooter className="sticky bottom-0 flex flex-col">
        <LoadingButton
          loading={mutation.isPending}
          onClick={() => form.handleSubmit(handleSubmit)()}
        >
          Update
        </LoadingButton>
      </SheetFooter>
    </>
  );
}
