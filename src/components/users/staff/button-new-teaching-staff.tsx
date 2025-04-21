"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FormAddEditTeachingStaff from "./form-add-edit-teaching-staff";

interface ButtonNewTeachingStaffProps {
  buttonLabel?: string;
  className?: string;
}
export default function ButtonNewTeachingStaff({
  buttonLabel,
  className,
}: ButtonNewTeachingStaffProps) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Button className={className} onClick={() => setOpenDialog(!openDialog)}>
        {buttonLabel || "New"}
      </Button>
      <FormAddEditTeachingStaff open={openDialog} setOpen={setOpenDialog} />
    </>
  );
}
