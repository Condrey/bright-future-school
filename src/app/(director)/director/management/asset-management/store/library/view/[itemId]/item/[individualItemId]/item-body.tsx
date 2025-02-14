"use client";

import AssetRepairSummary from "@/app/(director)/director/management/asset-management/asset-repair-summary";
import BookBorrowings from "@/components/books/(borrowing)/book-borrowings";
import LendBorrowBook from "@/components/books/(borrowing)/lend-book";
import ItemDamages from "@/components/damages/item-damages";
import LoadingButton from "@/components/loading-button";
import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { assetCategories, assetConditions, bookStatuses } from "@/lib/enums";
import { IndividualLibraryBookData } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  AssetCategory,
  AssetCondition,
  BookStatus,
  BorrowStatus,
} from "@prisma/client";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertTriangleIcon, ChevronDown, HistoryIcon } from "lucide-react";
import { useState } from "react";
import { getIndividualBook } from "../../action";
import ButtonEditIndividualItem from "./button-edit-individual-item";

interface ItemBodyProps {
  oldItem: IndividualLibraryBookData;
}

export default function ItemBody({ oldItem }: ItemBodyProps) {
  const queryKey: QueryKey = ["assets", "library-asset", "item", oldItem.id];
  const [viewMore, setViewMore] = useState(false);

  const {
    data: item,
    status,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: async () => getIndividualBook(oldItem.id),
    initialData: oldItem,
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <p className="max-w-sm text-center text-muted-foreground">
          Error upon fetching this item.
        </p>
        <LoadingButton
          variant="destructive"
          loading={isFetching}
          onClick={() => refetch()}
        >
          Refresh
        </LoadingButton>
      </div>
    );
  }
  if (!item) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <p className="max-w-sm text-center text-muted-foreground">
          Sorry, this item does not exist.!
        </p>
      </div>
    );
  }
  const Icon = assetCategories[item.libraryBook.asset.category].icon;
  const individualBookId = item.id;
  const borrowedStatus = item.borrowers.find(
    (b) => b.individualBookId === item.id,
  );
  const payments =
    item.bookDamages
      .flatMap(
        (a) =>
          a.assetRepairPayments
            .flatMap((r) => r.paidAmount)
            .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0,
      )
      .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

  const cost =
    item.bookDamages
      .flatMap((a) => a.repairPrice)
      .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

  const balance =
    item.bookDamages
      .flatMap((a) => a.repairBalance)

      .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;
  return (
    <div className="flex flex-col gap-8 xl:flex-row">
      <div className="mx-auto flex max-w-fit flex-wrap gap-4 xl:max-w-sm xl:*:w-full">
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <CardTitle>{item.libraryBook.title}</CardTitle>
                <CardDescription>{item.libraryBook.author}</CardDescription>
              </div>
              <ButtonEditIndividualItem individualItemToEdit={item} />
            </div>
            <Badge
              variant={!item.isbn ? "destructive" : "outline"}
              className={cn(
                "flex w-fit items-center",
                !item.isbn
                  ? "animate-pulse"
                  : "font-mono text-sm font-semibold tracking-wide",
              )}
            >
              {!item.isbn && <AlertTriangleIcon className="mr-2 size-4" />}
              {item.isbn || "Unknown ISBN, please update!"}
            </Badge>
            <Badge
              variant={
                borrowedStatus?.status === BorrowStatus.ONGOING
                  ? "warn"
                  : borrowedStatus?.status === BorrowStatus.RETURNED
                    ? "go"
                    : "outline"
              }
              className="w-fit"
            >
              <span className="w-fit">
                {borrowedStatus?.status || "Not borrowed yet"}
              </span>
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* condition  and status*/}
            <div className="flex flex-wrap gap-3 *:max-w-sm *:flex-1 *:rounded-md *:border *:p-2">
              <div className="space-y-2">
                <h4 className="italic">Condition</h4>
                <Badge
                  variant={
                    item.condition === AssetCondition.DAMAGED ||
                    item.condition === AssetCondition.POOR
                      ? "destructive"
                      : item.condition === AssetCondition.FAIR
                        ? "warn"
                        : "go"
                  }
                >
                  {assetConditions[item.condition]}
                </Badge>
              </div>
              <div className="space-y-2">
                <h4 className="italic">status</h4>
                <Badge
                  variant={
                    item.status === BookStatus.AVAILABLE
                      ? "go"
                      : item.status === BookStatus.BORROWED
                        ? "warn"
                        : "destructive"
                  }
                >
                  {bookStatuses[item.status]}
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className="w-full flex-col items-start">
            <Button
              variant={"link"}
              onClick={() => setViewMore(!viewMore)}
              className="mx-auto w-full max-w-fit"
            >
              <span>View {viewMore ? "less" : "more"}</span>
              <ChevronDown
                className={cn(
                  "size-3 transition-all duration-200 ease-linear",
                  viewMore && "rotate-180",
                )}
              />
            </Button>
            {viewMore && (
              <div className="w-full space-y-4">
                {/* date of creation  */}
                <div className="space-x-1 text-xs font-thin tracking-tight text-muted-foreground">
                  <HistoryIcon className="float-start size-4" />
                  {item.updatedAt > item.createdAt && (
                    <span>
                      (Updated on {format(item.updatedAt, "PPpp")}) and`
                    </span>
                  )}
                  <span>created on {format(item.createdAt, "PPpp")}</span>
                </div>
                {/* Asset  */}
                <div className="flex w-full items-center gap-1">
                  <hr className="w-full flex-1" />
                  <span className="text-muted-foreground">Asset details</span>
                  <hr className="w-full flex-1" />
                </div>
                <div>
                  <div className="flex items-start">
                    <Icon className="mr-2 size-4" />
                    <p>{item.libraryBook.asset.name}</p>
                  </div>
                  <p className="font-semibold italic">
                    Category:{" "}
                    {assetCategories[item.libraryBook.asset.category].label}
                  </p>
                  <TipTapViewer content={item.libraryBook.asset.description} />
                </div>
              </div>
            )}
          </CardFooter>
        </Card>
        <AssetRepairSummary cost={cost} payments={payments} balance={balance} />
      </div>

      <Tabs defaultValue="borrowing" className="mx-auto flex grow flex-col">
        <TabsList className="mx-auto flex w-full min-w-[28rem]">
          <TabsTrigger value="borrowing">Borrowings</TabsTrigger>

          <TabsTrigger value="damages">Damages</TabsTrigger>
        </TabsList>
        <TabsContent value={"damages"}>
          <h1 className="my-4 text-xl text-muted-foreground">
            Showing asset damages
          </h1>
          <ItemDamages
            individualItem={{ ...item, assetDamages: item.bookDamages }}
            assetCategory={AssetCategory.LIBRARY}
          />
        </TabsContent>

        <TabsContent value="borrowing">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="my-4 text-xl text-muted-foreground">
              Showing book borrowings
            </h1>
            <LendBorrowBook
              individualBookId={individualBookId}
              isBorrowed={borrowedStatus?.status === BorrowStatus.ONGOING}
            />
          </div>

          <BookBorrowings
            individualBookId={individualBookId}
            borrowers={item.borrowers}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
