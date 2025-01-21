"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import UserAvatar from "@/components/user-avatar";
import { PupilData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { FeesStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import ButtonAddFees from "./button-add-fees";

export const usePupilColumns = ({
  classTermId,
  feesAmount,
}: {
  classTermId: string;
  feesAmount: number;
}): ColumnDef<PupilData>[] => [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
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
            <div className="text-xs text-muted-foreground">{description}</div>
          </div>
        </div>
      );
    },
  },
  {
    id: "fees.paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid" />
    ),
    cell: ({ row }) => {
      const paid =
        row.original.fees
          .flatMap((f) => f.feesPayments.flatMap((p) => p.amountPaid))
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

      return <span>{formatCurrency(paid)}</span>;
    },
  },

  {
    id: "fees.status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fess Status" />
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
    id: "fees.balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
    cell: ({ row }) => {
      const paid =
        row.original.fees
          .flatMap((f) => f.feesPayments.flatMap((p) => p.amountPaid))
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

      return <span>{formatCurrency(feesAmount - paid)}</span>;
    },
  },
  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
      return <ButtonAddFees classTermId={classTermId} pupil={row.original} />;
    },
  },
];
