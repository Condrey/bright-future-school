"use client";

import { Button } from "@/components/ui/button";
import { ClassTerm } from "@prisma/client";
import { useState } from "react";
import EditTermForm from "./edit-term-form";

export interface ButtonUpdateClassTermProps {
  termToEdit: ClassTerm;
  academicYearClassId: string;
  levelId: string;
  termId: string;
  academicYear: string;
}

export default function ButtonUpdateClassTerm({
  termToEdit,
  academicYear,
  academicYearClassId,
  levelId,
  termId,
}: ButtonUpdateClassTermProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className="w-fit" onClick={() => setOpen(true)}>
        Edit term
      </Button>
      <EditTermForm
        open={open}
        setOpen={setOpen}
        termToEdit={termToEdit}
        academicYear={academicYear}
        academicYearClassId={academicYearClassId}
        levelId={levelId}
        termId={termId}
      />
    </>
  );
}
