"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { useState } from "react";
import FormAddEditExam from "./form-add-edit-exam";

interface ButtonAddNewExamProps extends ButtonProps {
  classTermId: string;
  academicYearClassId: string;
}

export default function ButtonAddNewExam({
  classTermId,
  academicYearClassId,
  ...props
}: ButtonAddNewExamProps) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setOpenDialog(!openDialog)} {...props}>
        {props.children}
      </Button>
      <FormAddEditExam
        open={openDialog}
        setOpen={setOpenDialog}
        classTermId={classTermId}
        academicYearClassId={academicYearClassId}
      />
    </>
  );
}
