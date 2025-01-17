"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FormAddEditNonTeachingStaff from "./form-add-edit-non-teaching-staff";

export default function ButtonNewNonTeachingStaff() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setOpenDialog(!openDialog)}>New</Button>
      <FormAddEditNonTeachingStaff open={openDialog} setOpen={setOpenDialog} />
    </>
  );
}
