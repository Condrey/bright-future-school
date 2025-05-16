"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/assets/add-assets/barrel-file";
import LoadingButton from "@/components/loading-button";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { assetUnits } from "@/lib/enums";
import { formatNumber } from "@/lib/utils";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { HistoryIcon, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { getAllLibraryAssetItems } from "./action";

export default function ListOfLibraryItems() {
  const queryKey: QueryKey = ["library-assets", "list"];

  const { data, status, error, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: getAllLibraryAssetItems,
  });

  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();

  if (status === "pending") {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <span className="text-muted-foreground max-w-sm text-center">
          Loading....
        </span>
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <span className="text-muted-foreground max-w-sm text-center">
          Error fetching library items
        </span>
        <LoadingButton
          loading={isFetching}
          onClick={() => refetch()}
          className="w-fit"
        >
          Refresh
        </LoadingButton>
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <span className="text-muted-foreground max-w-sm text-center">
          There are no library items in the system yet.
        </span>
      </div>
    );
  }
  return (
    <Card className="bg-muted/30 w-full">
      <CardHeader className="flex w-full flex-row gap-4">
        <div>
          <CardTitle>
            <div className="flex items-center">
              <HistoryIcon className="mr-2 size-4" />
              <span>List of recently added library items</span>
            </div>
          </CardTitle>
          <CardDescription>
            {formatNumber(data.length)} items in the database.
          </CardDescription>
        </div>
        <LoadingButton
          loading={isPending}
          size={"sm"}
          variant={"secondary"}
          onClick={() =>
            startTransition(() =>
              navigateOnclickWithPathnameWithoutUpdate(
                "/director/management/asset-management/store/library",
              ),
            )
          }
          className="ms-auto"
        >
          View all
        </LoadingButton>
      </CardHeader>
      <CardContent>
        <ul className="w-full list-inside list-decimal divide-y">
          {data.slice(0, 10).map((item, index) => (
            <li key={item.id} className="flex w-full items-start gap-2 py-2">
              <span>{index + 1}</span>
              <div className="flex flex-col">
                <span>{item.title}</span>
                <span className="text-muted-foreground text-xs italic">
                  by {item.author}
                </span>
              </div>

              <div className="ms-auto">
                <div className="flex items-center gap-1">
                  <span>{formatNumber(item.quantity || 0)}</span>
                  <span>{`${assetUnits[item.unit]}${item.quantity === 1 ? "" : "s"} `}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
