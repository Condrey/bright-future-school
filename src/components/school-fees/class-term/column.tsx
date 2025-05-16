"use client";

import { useSession } from "@/app/session-provider";
import ButtonAddFees from "@/components/school-fees/class-term/button-add-fees";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/user-avatar";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { PupilData } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { FeesStatus, Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowUpRightIcon,
  CopyIcon,
  Loader2Icon,
  MoreHorizontal,
} from "lucide-react";
import { useTransition } from "react";

export const usePupilColumns = ({
  classTermId,
  feesAmount,
}: {
  classTermId: string;
  feesAmount: number;
}): ColumnDef<PupilData>[] => {
  return [
    {
      id: "index",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="#" />
      ),
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      accessorKey: "user.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pupil/Student" />
      ),
      cell: ({ row }) => {
        const user = row.original.user;
        const name = user?.name;
        const avatarUrl = user?.avatarUrl;
        const description =
          user?.telephone || user?.email || `@${user?.username}`;
        return (
          <div className="flex gap-3">
            <UserAvatar avatarUrl={avatarUrl} />
            <div className="5 flex flex-col gap-0">
              <div>{name}</div>
              <div className="text-muted-foreground text-xs">{description}</div>
            </div>
          </div>
        );
      },
    },
    {
      id: "fees.amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fees amount" />
      ),
      cell({ row }) {
        // const rows = row.original.fees.flatMap(f=>f.term.feesAmount||0)
        // const feesAmount= !rows.length?0:rows[0];
        return <div>{formatCurrency(feesAmount)}</div>;
      },
    },
    {
      id: "fees.paid",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Paid" />
      ),
      cell: ({ row }) => {
        const payments = row.original.fees.flatMap((f) =>
          f.feesPayments.flatMap((p) => p.amountPaid),
        );
        const paid =
          payments.reduce((total, amount) => (total || 0) + (amount || 0), 0) ||
          0;

        return (
          <div>
            <div>{formatCurrency(paid)}</div>
            {!!payments.length && (
              <div className="text-muted-foreground text-xs">
                {payments.length === 1
                  ? "single-payment"
                  : `${formatNumber(payments.length)} payments`}
              </div>
            )}
          </div>
        );
      },
    },

    {
      id: "fees.balance",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Balance" />
      ),
      cell: ({ row }) => {
        const paid =
          row.original.fees
            .flatMap((f) => f.feesPayments.flatMap((p) => p.amountPaid))
            .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;
        const balance = feesAmount - paid;

        return (
          <div>
            <div className="font-bold">{formatCurrency(balance)}</div>
            {balance < 0 && (
              <div>
                <Badge variant={"destructive"} className="animate-pulse">
                  Extra Payment
                </Badge>
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "fees.last-payment",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last payment" />
      ),
      cell: ({ row }) => {
        const payments = row.original.fees.flatMap((f) =>
          f.feesPayments.flatMap((p) => p),
        );
        const lastPayment = !payments.length
          ? null
          : payments[payments.length - 1];

        return (
          <>
            {!lastPayment ? (
              <span className="text-muted-foreground italic">
                --No transactions--
              </span>
            ) : (
              <div>
                <div>
                  {lastPayment.updatedAt > lastPayment.createdAt
                    ? `(Updated) ${format(lastPayment.updatedAt, "PPPP")}`
                    : format(lastPayment.createdAt, "PPPP")}
                </div>
                <div>
                  <span className="text-muted-foreground italic">paid</span>{" "}
                  <span>{formatCurrency(lastPayment.amountPaid)}</span>
                </div>
              </div>
            )}
          </>
        );
      },
    },
    {
      id: "fees.status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fess status" />
      ),
      cell: ({ row }) => {
        const paid =
          row.original.fees
            .flatMap((f) => f.feesPayments.flatMap((p) => p.amountPaid))
            .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;
        const feesStatus =
          paid <= 0
            ? FeesStatus.NILL
            : paid >= feesAmount
              ? FeesStatus.COMPLETED
              : FeesStatus.PENDING;
        return (
          <Badge
            variant={
              feesStatus === FeesStatus.NILL
                ? "destructive"
                : feesStatus === FeesStatus.PENDING
                  ? "warn"
                  : "go"
            }
          >
            {feesStatus}
          </Badge>
        );
      },
    },
    {
      id: "action",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => {
        const pupil = row.original;
        const { user } = useSession();
        const { navigateOnclickWithoutUpdate } = useCustomSearchParams();
        const [isPending, startTransition] = useTransition();
        return (
          <div className="flex items-center gap-2">
            <ButtonAddFees classTermId={classTermId} pupil={row.original} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                  <span className="sr-only">Open menu</span>
                  {isPending ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <MoreHorizontal />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    startTransition(() =>
                      navigateOnclickWithoutUpdate(`/${pupil.user?.username}`),
                    )
                  }
                >
                  <ArrowUpRightIcon className="mr-2 size-4" />
                  <span>View {pupil.user?.name?.split(" ").pop()}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(pupil.id)}
                >
                  <CopyIcon className="mr-2 size-4" />
                  <span>Copy pupil Id</span>
                </DropdownMenuItem>
                {user.role === Role.SUPER_ADMIN && (
                  <DropdownMenuItem
                    onClick={() =>
                      navigator.clipboard.writeText(JSON.stringify(pupil))
                    }
                  >
                    <CopyIcon className="mr-2 size-4" />
                    <span>Copy class Teacher</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};
