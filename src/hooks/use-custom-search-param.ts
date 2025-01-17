"use client ";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useCustomSearchParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateSearchParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const navigateOnclick = useCallback(
    (name: string, value: string, pathname?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.push(!pathname ? "" : pathname + "?" + params.toString());
    },
    [searchParams, router],
  );

  const navigateOnclickWithoutUpdate = useCallback(
    (pathname?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      router.push(!pathname ? "" : pathname + "?" + params.toString());
    },
    [searchParams, router],
  );

  return { updateSearchParams, navigateOnclick, navigateOnclickWithoutUpdate };
};
