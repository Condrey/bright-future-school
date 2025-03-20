import ButtonAddNewExam from "@/components/exams/exam/button-add-exam";
import LoadingButton from "@/components/loading-button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SheetFooter } from "@/components/ui/sheet";
import { ExamData, TermWithYearData } from "@/lib/types";
import {
  ExamSchema,
  MultipleExamSchema,
  multipleExamSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";

interface ListOfTermsWithExamsProps {
  classTerms: TermWithYearData[];
  academicYearClassId: string;
  exams: ExamData[];
}

export default function ListOfTermsWithExams({
  classTerms,
  academicYearClassId,
  exams,
}: ListOfTermsWithExamsProps) {
  const form = useForm<MultipleExamSchema>({
    resolver: zodResolver(multipleExamSchema),
    values: {
      exams: exams as ExamSchema[],
    },
  });
  function handleSubmit(input: MultipleExamSchema) {}
  return (
    <>
      <div className="space-y-4">
        {classTerms.map((classTerm) => (
          <div className="space-y-2" key={classTerm.id}>
            <h2 className="text-lg font-semibold">
              {classTerm.term?.term} term
            </h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                  control={form.control}
                  name="exams"
                  render={() => (
                    <FormItem>
                      {classTerm.exams.map((exam, index) => (
                        <FormField
                          key={exam.id}
                          control={form.control}
                          name={"exams"}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value
                                    .flatMap((f) => f.id)
                                    .includes(exam.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, exam])
                                      : field.onChange(
                                          field.value.filter(
                                            (d) => d.id !== exam.id,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {exam.examName}
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
      </div>
      <hr className="my-4" />
      <SheetFooter className="sticky bottom-0 flex flex-row items-center gap-2">
        <ButtonAddNewExam
          variant={"outline"}
          size={"default"}
          //   disabled={mutation.isPending}
        >
          <PlusIcon className="size-4" />
          <span>Exam</span>
        </ButtonAddNewExam>
        <LoadingButton
          size={"default"}
          //   loading={mutation.isPending}
          loading
          disabled={!form.formState.isDirty}
          onClick={() => form.handleSubmit(handleSubmit)()}
        >
          Update
        </LoadingButton>
      </SheetFooter>
    </>
  );
}
