"use client";

import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form } from "@/components/ui/form";
import { borrowerSchema, BorrowerSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { BorrowStatus } from "@prisma/client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { BookIcon, UserPenIcon, Users2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormBorrowers from "./form-borrowers";
import { useLendBookMutation } from "./mutation";

interface LendBorrowBookProps {
  isBorrowed: boolean;
  isSecondary?: boolean;
  individualBookId: string;
}

export default function LendBorrowBook({
  isBorrowed,
  individualBookId,
  isSecondary = false,
}: LendBorrowBookProps) {
  const [open, setOpen] = useState(false);
  const [isAStaff, setIsAStaff] = useState(false);
  const form = useForm<BorrowerSchema>({
    resolver: zodResolver(borrowerSchema),
    defaultValues: {
      borrowedAt: new Date(),
      id: "",
      individualBookId,
      returnAt: undefined,
      status: BorrowStatus.ONGOING,
      userId: "",
    },
  });
  const { mutate, isPending } = useLendBookMutation();
  function handleClick(personIsAStaff: boolean) {
    setIsAStaff(personIsAStaff);
    setOpen(true);
  }
  function handleSubmit(input: BorrowerSchema) {
    mutate({ input }, { onSuccess: () => setOpen(false) });
  }
  return (
    <>
      {!isBorrowed && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={isSecondary ? "secondary" : "default"}>
              <BookIcon className="ml-2 size-4" />
              <span>{isBorrowed ? "Retrieve" : "Lend"} book</span>
              <CaretSortIcon className="ml-2 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Select the type of borrower</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleClick(false)}>
                <Users2Icon className="mr-2 size-4" />
                <span>Pupil/ student</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleClick(true)}>
                <UserPenIcon className="mr-2 size-4" />
                <span>A staff</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <ResponsiveDrawer
        open={open && !isBorrowed}
        setOpen={setOpen}
        title={`Lend this book`}
        description={`Lending to ${isAStaff ? "a staff member:" : "a pupil/ student"}`}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
            <FormBorrowers form={form} isAStaff={isAStaff} />
            <div className="flex w-full items-center justify-end gap-3">
              <LoadingButton loading={isPending}>Lend</LoadingButton>
            </div>
          </form>
        </Form>
      </ResponsiveDrawer>
    </>
  );
}
