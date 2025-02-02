import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FormAddEditDamage from "./form-add-edit-damage";

interface ButtonRecordDamageProps {
  label?: string;
  className?: string;
  parentId: string;
}

export default function ButtonRecordDamage({
  label,
  className,
  parentId,
}: ButtonRecordDamageProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant={!label ? "default" : "secondary"}
        onClick={() => setOpen(true)}
        className={cn("w-fit", className)}
      >
        {label || "Register a damage"}
      </Button>
      <FormAddEditDamage open={open} setOpen={setOpen} parentId={parentId} />
    </>
  );
}
