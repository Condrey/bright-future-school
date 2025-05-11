"use client";

import LoadingButton from "@/components/loading-button";
import { Button, ButtonProps } from "@/components/ui/button";
import { PupilRow } from "@/lib/types";
import { useState } from "react";
import FormEditExamScores from "./form-edit-exam-scores";

interface ButtonEditExamScoresProps extends ButtonProps {
  pupilRow: PupilRow;
}

export default function ButtonEditExamScores({
  pupilRow,
  ...props
}: ButtonEditExamScoresProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} {...props} />
      <FormEditExamScores open={open} setOpen={setOpen} pupilRow={pupilRow} />
    </>
  );
}
