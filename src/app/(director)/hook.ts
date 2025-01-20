"use client";
import { QueryKey, useQuery } from "@tanstack/react-query";
import {
  getDirectorDashboardParams,
  getPlainTerms,
  getPlainYears,
} from "./action";

export const directorDashboardParamsQueryKey: QueryKey = ["director-dashboard"];
export const yearSwitcherQueryKey: QueryKey = ["year-switcher"];
export const termSwitcherQueryKey: QueryKey = ["term-switcher"];

export function useDirectorDashboardParamsQuery() {
  const query = useQuery({
    queryKey: directorDashboardParamsQueryKey,
    queryFn: getDirectorDashboardParams,
    staleTime: Infinity,
  });
  return query;
}

export function useYearSwitcherQuery() {
  const query = useQuery({
    queryKey: yearSwitcherQueryKey,
    queryFn: getPlainYears,
    staleTime: Infinity,
  });
  return query;
}

export function useTermSwitcherQuery() {
  const query = useQuery({
    queryKey: termSwitcherQueryKey,
    queryFn: getPlainTerms,
    staleTime: Infinity,
  });
  return query;
}
