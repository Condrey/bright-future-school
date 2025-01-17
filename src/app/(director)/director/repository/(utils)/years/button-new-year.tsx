"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FormAddEditYear from "./form-add-edit-year";

export default function ButtonNewYear() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setOpenDialog(!openDialog)}>New</Button>
      <FormAddEditYear open={openDialog} setOpen={setOpenDialog} />
    </>
  );
}
