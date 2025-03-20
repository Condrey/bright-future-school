'use client'

import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import { Grading } from "@prisma/client";
import { useDeleteGradingMutation } from "./mutation";
import { useState } from "react";
import { TrashIcon } from "lucide-react";

interface ButtonDeleteGradingProps{
   
    grading : Grading;
}

export default function ButtonDeleteGrading({grading}: ButtonDeleteGradingProps) {
const [open , setOpen ] = useState(false);
    const {isPending,mutate} = useDeleteGradingMutation()
    return (
      <>
      <Button variant={'destructive'} size={'icon'} className="rounded-full"
      onClick={()=>setOpen(true)}>
          <TrashIcon className="size-5 "/>
      </Button> 
        <ResponsiveDrawer open={open} setOpen={setOpen} title="Delete Grading">
          <div className="p-4">
            <p>Are you sure you want to delete this grading?</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={() => setOpen(false)} variant={"outline"}>
                Cancel
              </Button>
              <LoadingButton
                loading={isPending}
                variant={"destructive"}
                onClick={() =>
                  mutate(grading.id, {
                    onSuccess: () => setOpen(false),
                  })
                }
              >
                Delete
              </LoadingButton>
            </div>
          </div>
        </ResponsiveDrawer>
      </>
    );
}