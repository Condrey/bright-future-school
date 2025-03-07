"use client ";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useCustomSearchParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPathname = usePathname();

  const updateSearchParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );
  const updateSearchParamsAndNavigate = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.push(currentPathname + "?" + params.toString());
    },
    [searchParams, currentPathname, router],
  );

  const navigateOnclick = useCallback(
    (name: string, value: string, pathname?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.push((!pathname ? "" : pathname) + "?" + params.toString());
    },
    [searchParams, router],
  );

  const getNavigationLinkWithoutUpdate = useCallback(
    (pathnameEndPoint?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      return (
        currentPathname +
        (!pathnameEndPoint ? "" : pathnameEndPoint) +
        "?" +
        params.toString()
      );
    },
    [searchParams, router, currentPathname],
  );

  const getNavigationLinkWithPathnameWithoutUpdate = useCallback(
    (pathname: string) => {
      const params = new URLSearchParams(searchParams.toString());
      return (
        pathname + "?" + params.toString()
      )
    },
    [searchParams, router],
  );

  const navigateOnclickWithoutUpdate = useCallback(
    (pathnameEndPoint?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      router.push(
        currentPathname +
          (!pathnameEndPoint ? "" : pathnameEndPoint) +
          "?" +
          params.toString(),
      );
    },
    [searchParams, router, currentPathname],
  );

  const navigateOnclickWithPathnameWithoutUpdate = useCallback(
    (pathname: string) => {
      const params = new URLSearchParams(searchParams.toString());

      router.push(pathname + "?" + params.toString());
    },
    [searchParams, router],
  );

  return {
    updateSearchParams,
    updateSearchParamsAndNavigate,
    navigateOnclick,
    navigateOnclickWithoutUpdate,
    navigateOnclickWithPathnameWithoutUpdate,
    getNavigationLinkWithoutUpdate,
    getNavigationLinkWithPathnameWithoutUpdate
  };
};
