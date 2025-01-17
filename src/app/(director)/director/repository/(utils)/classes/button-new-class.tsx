"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FormAddEditClass from "./form-add-edit-class";

export default function ButtonNewClass() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setOpenDialog(!openDialog)}>New</Button>
      <FormAddEditClass open={openDialog} setOpen={setOpenDialog} />
    </>
  );
}
