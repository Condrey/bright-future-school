"use client";

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
import { PupilRow } from "@/lib/types";
import {
  ExamScoreSchema,
  multipleExamScoreSchema,
  MultipleExamScoreSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUpdateExamScoresMutation } from "./mutation";

interface FormEditExamScoresProps {
  pupilRow: PupilRow;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormEditExamScores({
  pupilRow,
  open,
  setOpen,
}: FormEditExamScoresProps) {
  const pupil = pupilRow.pupil.user;
  const pupilId = pupilRow.pupil.id;

  const examScores = pupilRow.examSubjects.flatMap((examSubject) => {
    const hasExistingScore = examSubject.examScores.some(
      (score) => score.pupilId === pupilId
    );
  
    if (hasExistingScore) {
      // Return only existing scores for this pupil & examSubject
      return examSubject.examScores.filter((s) => s.pupilId === pupilId);
    } else {
      // Create a new score only if none exists
      return [{
        id: "",
        score: 0,
        examSubjectId: examSubject.id,
        pupilId,
      }];
    }
  });

  const form = useForm<MultipleExamScoreSchema>({
    resolver: zodResolver(multipleExamScoreSchema),
    values: {
      examScores,
    },
    progressive: true,
  });
  const { mutate, isPending } = useUpdateExamScoresMutation();
  const onSubmit = (input: MultipleExamScoreSchema) => {
    mutate(input, {
      onSuccess() {
        setOpen(false);
      },
    });
  };
  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={`Exam scores for ${pupil?.name} (${pupil?.telephone || pupil?.email || `@${pupil?.username}`})`}
      description="Update scores for this particular pupil/ student."
      className="max-w-3xl"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* <pre>**{JSON.stringify(pupilRow.examSubjects, null, 2)}</pre> */}
          <FormField
            control={form.control}
            name="examScores"
            render={({ field }) => (
              <FormItem>
                {field.value.map((examScore, index) => {
                  const subject = pupilRow.examSubjects.find(
                    (examSubject) => examSubject.id === examScore.examSubjectId,
                  )?.academicYearSubject.subject;
                  return (
                    <FormField
                      key={examScore.examSubjectId}
                      control={form.control}
                      name={`examScores.${index}.score`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize">
                            {subject?.code} {subject?.subjectName} (
                            {subject?.slug})
                          </FormLabel>
                          <FormControl>
                            <NumberInput
                              {...field}
                              placeholder={`please enter ${subject?.subjectName} score`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                })}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-3">
            <LoadingButton loading={isPending}>Submit</LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
