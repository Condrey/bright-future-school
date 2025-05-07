"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { ExamData } from "@/lib/types";
import { useState } from "react";
import FormAddEditExamSubject from "./form-add-edit-exam-subject";

interface ButtonUpdateExamSubjectsProps extends ButtonProps {
  exam: ExamData;
}
export default function ButtonUpdateExamSubjects({
  exam,
  ...props
}: ButtonUpdateExamSubjectsProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} {...props} />
      <FormAddEditExamSubject exam={exam} open={open} setOpen={setOpen} />
    </>
  );
}
