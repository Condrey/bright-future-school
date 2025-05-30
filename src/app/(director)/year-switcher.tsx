"use client";

import {
  CalendarDaysIcon,
  CalendarSearchIcon,
  ChevronsUpDown,
  Plus,
} from "lucide-react";

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
import { PARAM_NAME_ACADEMIC_YEAR } from "@/lib/constants";
import { myPrivileges } from "@/lib/enums";
import { Role } from "@prisma/client";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useSession } from "../session-provider";
import FormAddEditYear from "./director/repository/(utils)/years/form-add-edit-year";
import { useYearSwitcherQuery } from "./hook";

interface YearSwitcherProps {
  pathname?: string;
}

export default function YearSwitcher({ pathname }: YearSwitcherProps) {
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);

  const { user } = useSession();
  const canAddYears = myPrivileges[user.role].includes(Role.DIRECTOR);
  const { navigateOnclick } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();

  const { data, status, isFetching, refetch, error } = useYearSwitcherQuery();

  const { isMobile } = useSidebar();

  const searchParams = useSearchParams();

  const searchParamYear =
    searchParams.get(PARAM_NAME_ACADEMIC_YEAR) ?? undefined;

  if (status === "pending") {
    return <YearSwitcherFallback />;
  }
  if (status === "error") {
    console.error(error);
    toast({
      description: "Error occurred while fetching academic years.",
      variant: "destructive",
    });
    return (
      <LoadingButton
        loading={isFetching}
        variant={"destructive"}
        onClick={() => refetch()}
      >
        Refetch Years
      </LoadingButton>
    );
  }
  if (status === "success" && !data.length) {
    return;
  }
  const activeYear = data.find(
    (l) => l.year.toLowerCase() === searchParamYear?.toLowerCase(),
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
              <CalendarDaysIcon className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {!activeYear ? "All years" : activeYear.year}
              </span>
              <span className="truncate text-xs">
                {!activeYear
                  ? "Showing all years"
                  : `${format(
                      activeYear.startAt,
                      "MMMM",
                    )}-${format(activeYear.endAt, "MMMM")}`}
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
            Academic years
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={async () =>
              startTransition(() =>
                navigateOnclick(PARAM_NAME_ACADEMIC_YEAR, "", pathname),
              )
            }
            className="gap-2 p-2"
          >
            <div className="flex size-6 items-center justify-center rounded-sm border">
              <CalendarSearchIcon className="size-4 shrink-0" />
            </div>
            All years
          </DropdownMenuItem>
          {data.map((item) => {
            return (
              <DropdownMenuItem
                key={item.id}
                onClick={async () =>
                  startTransition(() =>
                    navigateOnclick(
                      PARAM_NAME_ACADEMIC_YEAR,
                      item.year,
                      pathname,
                    ),
                  )
                }
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <CalendarSearchIcon className="size-4 shrink-0" />
                </div>
                {item.year}
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          {canAddYears && (
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => setOpenAddItemDialog(true)}
            >
              <div className="flex size-6 items-center justify-center">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add year</div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <FormAddEditYear
        open={openAddItemDialog}
        setOpen={setOpenAddItemDialog}
      />
    </>
  );
}

export function YearSwitcherFallback() {
  return (
    <Button
      size="lg"
      variant={"outline"}
      className="flex h-fit w-full max-w-sm justify-between px-4 py-2"
    >
      <Skeleton className="bg-sidebar-primary flex aspect-square size-8 rounded-lg">
        <Skeleton className="size-4" />
      </Skeleton>
      <div className="grid flex-1 space-y-1">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="ml-auto size-6" />
    </Button>
  );
}
