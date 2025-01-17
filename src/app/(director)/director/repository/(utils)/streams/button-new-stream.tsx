"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FormAddEditStream from "./form-add-edit-stream";

export default function ButtonNewStream() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setOpenDialog(!openDialog)}>New</Button>
      <FormAddEditStream open={openDialog} setOpen={setOpenDialog} />
    </>
  );
}
