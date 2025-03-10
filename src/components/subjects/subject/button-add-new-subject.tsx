"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FormAddEditSubject from "./form-add-edit-subject";

export default function ButtonAddNewSubject() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setOpenDialog(!openDialog)}>New</Button>
      <FormAddEditSubject open={openDialog} setOpen={setOpenDialog} />
    </>
  );
}
