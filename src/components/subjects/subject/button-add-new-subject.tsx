"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { useState } from "react";
import FormAddEditSubject from "./form-add-edit-subject";

interface ButtonAddNewSubjectProps extends ButtonProps {}
export default function ButtonAddNewSubject({
  className,
  ...props
}: ButtonAddNewSubjectProps) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setOpenDialog(!openDialog)} {...props}>
        {props.children}
      </Button>
      <FormAddEditSubject open={openDialog} setOpen={setOpenDialog} />
    </>
  );
}
