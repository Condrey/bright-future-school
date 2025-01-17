"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FormAddEditTerm from "./form-add-edit-term";

export default function ButtonNewTerm() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setOpenDialog(!openDialog)}>New</Button>
      <FormAddEditTerm open={openDialog} setOpen={setOpenDialog} />
    </>
  );
}
