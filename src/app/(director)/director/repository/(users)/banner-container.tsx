"use client";

import { useDirectorDashboardParamsQuery } from "@/app/(director)/hook";
import { AlertTriangle } from "lucide-react";

export default function BannerContainer() {
  const { data, status } = useDirectorDashboardParamsQuery();

  if (status === "pending" || status === "error") {
    return;
  }
  let missingUsers = [
    data.teachingStaffs < 1 && "teaching staffs",
    data.nonTeachingStaffs < 1 && "non teaching staffs",
    data.pupils < 1 && "pupils",
  ].filter(Boolean) as string[];

  return (
    <>
      {!!missingUsers.length && (
        <div className="bg-destructive/80 px-4 py-2 text-destructive-foreground">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4" />
            <p>
              Missing information for <cite>{missingUsers.join(", ")}</cite>.
              Please add {missingUsers.length === 1 ? "it" : "them"} to the
              database.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
