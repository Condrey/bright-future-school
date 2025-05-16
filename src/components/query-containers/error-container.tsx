"use client";

import { DefinedUseQueryResult } from "@tanstack/react-query";
import LoadingButton from "../loading-button";

interface ErrorContainerProps {
  errorMessage: string;
  query: DefinedUseQueryResult;
}

export default function ErrorContainer({
  errorMessage,
  query,
}: ErrorContainerProps) {
  console.error(query.error);
  return (
    <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground max-w-sm text-center">
        {errorMessage}
      </p>
      <LoadingButton
        loading={query.isFetching}
        variant={"destructive"}
        onClick={() => query.refetch()}
      >
        Refresh
      </LoadingButton>
    </div>
  );
}
