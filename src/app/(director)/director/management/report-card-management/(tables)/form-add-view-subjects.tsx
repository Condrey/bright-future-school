"use client";

import LoadingButton from "@/components/loading-button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAllSubjectsQuery } from "./hook";
import { Form, FormField } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { multipleSubjectSchema, MultipleSubjectSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";

interface FormAddViewSubjectsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddViewSubjects({
  open,
  setOpen,
}: FormAddViewSubjectsProps) {
    const form = useForm<MultipleSubjectSchema>({
        resolver: zodResolver(multipleSubjectSchema),
        defaultValues:{subjects:[]}
    })
    const {append,remove,} = useFieldArray({control:form.control,name:'subjects', })
  const { data, status, error, refetch, isFetching } = useAllSubjectsQuery();
  if(status==='error'){console.error(error)}
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Class subjects</SheetTitle>
          <SheetDescription>Please choose class subjects</SheetDescription>
        </SheetHeader>
        <div>
          {status === "pending" ? (
            <div className="min-h-[20rem] flex flex-col items-center justify-center gap-4">
              <p className="max-w-sm text-center text-muted-foreground">
                Loading...
              </p>
            </div>
          ) : status === "error" ? (
            <div className="min-h-[20rem] flex flex-col items-center justify-center gap-4">
              <p className="max-w-sm text-center text-muted-foreground">
                Ann error occurred while fetching subjects
              </p>
              <LoadingButton loading={isFetching} onClick={() => refetch()}>
                Refetch
              </LoadingButton>
            </div>
          ) : status === "success" && !data.length ? (
            <div className="min-h-[20rem] flex flex-col items-center justify-center gap-4">
              <p className="max-w-sm text-center text-muted-foreground">
                There are no subjects in the database yet
              </p>
            </div>
          ) : (
            <Form {...form}>
               {/* <form onSubmit={form.handleSubmit()}>
               {
                    data.map(subject=>
                        <FormField

                        />
                    )
                }
               </form> */}
               <pre>{JSON.stringify(data,null,2)}</pre>
            </Form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
