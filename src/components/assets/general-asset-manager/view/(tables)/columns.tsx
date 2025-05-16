import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { assetConditions, assetStatuses } from "@/lib/enums";
import { IndividualGeneralStoreItemData } from "@/lib/types";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { AssetCondition, AssetStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DropDownMenuIndividualItem from "./drop-down-menu-individual-item";

export const useItemColumn: ColumnDef<IndividualGeneralStoreItemData>[] = [
  {
    id: "index",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="#" />;
    },
    cell: ({ row }) => <span className="tabular-nums">{row.index + 1}</span>,
  },
  {
    accessorKey: "generalStoreItem.name",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Items" />;
    },
    cell: ({ row }) => {
      const generalStoreItem = row.original.generalStoreItem;
      return (
        <div>
          <div>{generalStoreItem.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "uniqueIdentifier",
    header({ column }) {
      return (
        <DataTableColumnHeader column={column} title="unique Identifier" />
      );
    },
    cell: ({ row }) => (
      <Badge
        className={cn(
          "font-mono tracking-wide",
          !row.original.uniqueIdentifier && "animate-pulse",
        )}
        variant={!row.original.uniqueIdentifier ? "destructive" : "outline"}
      >
        {row.original.uniqueIdentifier || "Not set"}
      </Badge>
    ),
  },
  {
    accessorKey: "condition",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Condition" />;
    },
    cell: ({ row }) => {
      const condition = row.original.condition;
      return (
        <Badge
          variant={
            condition === AssetCondition.DAMAGED ||
            condition === AssetCondition.POOR
              ? "destructive"
              : condition === AssetCondition.FAIR
                ? "warn"
                : "go"
          }
        >
          {assetConditions[condition]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === AssetStatus.AVAILABLE
              ? "go"
              : status === AssetStatus.UNDER_MAINTENANCE
                ? "warn"
                : "destructive"
          }
        >
          {assetStatuses[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "_count.assetDamages",
    header({ column }) {
      return (
        <DataTableColumnHeader column={column} title="Registered damages" />
      );
    },
    cell: ({ row }) => {
      const damages = row.original._count.assetDamages;
      return (
        <div>
          {damages === 0 ? (
            <Badge variant={"outline"}>{"Not registered"}</Badge>
          ) : (
            <Badge
              variant={"secondary"}
            >{`${formatNumber(damages)} record${damages === 1 ? "" : "s"}`}</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "_count.assetDamages.repairs",
    header({ column }) {
      return (
        <DataTableColumnHeader column={column} title="Performed repairs" />
      );
    },
    cell: ({ row }) => {
      const repairs = row.original.assetDamages.filter(
        (a) => a.isRepaired,
      ).length;
      return (
        <div>
          {repairs === 0 ? (
            <div>{"No repairs"}</div>
          ) : (
            <div>{`${formatNumber(repairs)} repair${repairs === 1 ? "" : "s"}`}</div>
          )}
        </div>
      );
    },
  },
  {
    id: "assetDamages.repairPrice",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Repair cost" />;
    },
    cell({ row }) {
      const price =
        row.original.assetDamages
          .flatMap((a) => a.repairPrice)
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;
      return formatCurrency(price);
    },
  },
  {
    id: "assetDamages.repairBalance",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Repair balance" />;
    },
    cell({ row }) {
      const hasDamages = !!row.original.assetDamages.length;

      const balance =
        row.original.assetDamages
          .flatMap((a) => a.repairBalance)
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;
      const paid =
        row.original.assetDamages
          .flatMap((a) => a.assetRepairPayments.flatMap((p) => p.paidAmount))
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

      return (
        <div>
          {hasDamages ? (
            <div>
              {paid <= 0 ? (
                <Badge variant={"destructive"}>Not paid</Badge>
              ) : (
                <div>Paid {formatCurrency(paid)}</div>
              )}
              <div>
                <span className="text-muted-foreground italic">bal of</span>{" "}
                {formatCurrency(balance)}
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground italic">
              --Not applicable--
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "action",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Action" />;
    },
    cell: ({ row }) => <DropDownMenuIndividualItem item={row.original} />,
  },
];
