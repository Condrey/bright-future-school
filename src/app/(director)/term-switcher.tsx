"use client";

import { BlocksIcon, ChevronsUpDown, Plus } from "lucide-react";

import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { toast } from "@/hooks/use-toast";
import { PARAM_NAME_TERM } from "@/lib/constants";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useSession } from "../session-provider";
import FormAddEditTerm from "./director/repository/(utils)/terms/form-add-edit-term";
import { useTermSwitcherQuery } from "./hook";

interface TermSwitcherProps {
  pathname?: string;
}

export default function TermSwitcher({ pathname }: TermSwitcherProps) {
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);

  const { user } = useSession();
  const canAddTerm = myPrivileges[user.role].includes(Role.DIRECTOR);
  const { navigateOnclick } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();

  const { data, status, isFetching, refetch, error } = useTermSwitcherQuery();

  const { isMobile } = useSidebar();

  const searchParams = useSearchParams();

  const searchParamTerm = searchParams.get(PARAM_NAME_TERM) ?? undefined;

  if (status === "pending") {
    return <TermSwitcherFallback />;
  }
  if (status === "error") {
    console.error(error);
    toast({
      description: "Error occurred while fetching academic terms.",
      variant: "destructive",
    });
    return (
      <LoadingButton
        loading={isFetching}
        variant={"destructive"}
        onClick={() => refetch()}
      >
        Refetch Terms
      </LoadingButton>
    );
  }
  if (status === "success" && !data.length) {
    return;
  }
  const activeTerm = data.find(
    (l) => l.id.toLowerCase() === searchParamTerm?.toLowerCase(),
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <LoadingButton
            loading={isPending}
            size="lg"
            variant={"outline"}
            className="flex h-fit w-full max-w-sm justify-between px-4 py-2"
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <BlocksIcon className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {!activeTerm ? "All terms" : activeTerm.term}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </LoadingButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-fit min-w-56 rounded-lg"
          align="start"
          side={isMobile ? "bottom" : "right"}
          sideOffset={4}
        >
          <DropdownMenuLabel className="text-muted-foreground text-xs">
            Academic year terms
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              startTransition(() => {
                navigateOnclick(PARAM_NAME_TERM, "", pathname);
              });
            }}
            className="gap-2 p-2"
          >
            <div className="flex size-6 items-center justify-center rounded-sm border">
              <BlocksIcon className="size-4 shrink-0" />
            </div>
            All terms
          </DropdownMenuItem>
          {data.map((item) => {
            return (
              <DropdownMenuItem
                key={item.id}
                onClick={() =>
                  startTransition(() => {
                    navigateOnclick(PARAM_NAME_TERM, item.id, pathname);
                  })
                }
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <BlocksIcon className="size-4 shrink-0" />
                </div>
                {item.term}
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          {canAddTerm && (
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => setOpenAddItemDialog(true)}
            >
              <div className="flex size-6 items-center justify-center">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add term</div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <FormAddEditTerm
        open={openAddItemDialog}
        setOpen={setOpenAddItemDialog}
      />
    </>
  );
}

export function TermSwitcherFallback() {
  return (
    <Button
      size="lg"
      variant={"outline"}
      className="flex h-fit w-full max-w-sm justify-between px-4 py-2"
    >
      <Skeleton className="bg-sidebar-primary flex aspect-square size-8 rounded-lg">
        <Skeleton className="size-4" />
      </Skeleton>
      <Skeleton className="h-4 w-3/4" />

      <Skeleton className="ml-auto size-6" />
    </Button>
  );
}
