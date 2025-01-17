"use client";

import { useSession } from "@/app/session-provider";
import LoadingButton from "@/components/loading-button";
import { Suspense } from "react";
import { useDirectorDashboardParamsQuery } from "../hook";
import DashboardComponents from "./dashboard-components";
import UtilitySetupComponent, {
  UtilitySetupComponentFallback,
} from "./utility-setup-component";

export default function PageComponents() {
  const { user } = useSession();
  if (!user) {
    throw new Error("Unauthorized.!");
  }
  const { status, error, data, refetch, isFetching } =
    useDirectorDashboardParamsQuery();
  if (error) {
    console.error(error);
  }
  return (
    <div className="size-full space-y-12">
      <p className="text-center">
        Welcome back Director{" "}
        <strong className="text-2xl font-semibold">
          {user.name ?? `@${user.username}`}!
        </strong>
      </p>
      {status === "pending" ? (
        <UtilitySetupComponentFallback />
      ) : status === "error" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">
            oops! an error occurred while fetching your dashboard parameters.
          </p>
          <LoadingButton
            loading={isFetching}
            className="w-fit"
            onClick={() => refetch()}
          >
            Refresh
          </LoadingButton>
        </div>
      ) : status === "success" && data.classStreams < 1 ? (
        <div>
          {/* Show utility set up  */}
          <Suspense fallback={<UtilitySetupComponentFallback />}>
            <UtilitySetupComponent dashboardParams={data} />
          </Suspense>
        </div>
      ) : (
        <div>
          {/* show the dashboard  */}
          <DashboardComponents />
        </div>
      )}
    </div>
  );
}
