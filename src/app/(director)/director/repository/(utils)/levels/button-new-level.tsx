'use client'
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FormAddEditLevel from "./form-add-edit-level";

export default function ButtonNewLevel() {
    const [openDialog, setOpenDialog] = useState(false);
    
    return (
      <>
        <Button onClick={() => setOpenDialog(!openDialog)}>New</Button>
        <FormAddEditLevel open={openDialog} setOpen={setOpenDialog} />
      </>
    );
}