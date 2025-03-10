import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { multipleSubjectSchema, MultipleSubjectSchema } from "@/lib/validation";

import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Subject } from "@prisma/client";
import { useForm } from "react-hook-form";

interface ListOfSubjectsProps {
  subjects: Subject[];
}
export default function ListOfSubjects({ subjects }: ListOfSubjectsProps) {
  const form = useForm<MultipleSubjectSchema>({
    resolver: zodResolver(multipleSubjectSchema),
    values: { subjects: subjects },
  });
  function handleSubmit(input: MultipleSubjectSchema) {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {subjects.map((subject, index) => (
          <FormField
            key={subject.id}
            control={form.control}
            name={`subjects.${index}`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex gap-1">
                    <Checkbox />
                    <FormLabel>{field.value.subjectName}</FormLabel>
                  </div>
                </FormControl>
                <FormDescription />
              </FormItem>
            )}
          />
        ))}
      </form>
    </Form>
  );
}
