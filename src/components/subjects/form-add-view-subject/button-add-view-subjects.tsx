'use client'

import { Button, ButtonProps } from "@/components/ui/button";
import { ClassStreamData } from "@/lib/types";
import { useState } from "react";
import FormAddViewSubjects from "./form-add-view-subjects";

interface ButtonAddViewSubjectsProps extends ButtonProps {
  classStream: ClassStreamData;
}

export default function ButtonAddViewSubjects({
  classStream,
  ...props
}: ButtonAddViewSubjectsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} {...props} />
      <FormAddViewSubjects
        open={open}
        setOpen={setOpen}
        classStream={classStream}
      />
    </>
  );
}
