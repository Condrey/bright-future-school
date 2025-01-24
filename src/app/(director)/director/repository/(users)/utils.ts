import { QueryKey } from "@tanstack/react-query";

export const yearClassStreamsQueryKey = (year: string): QueryKey => [
  "year-class-streams",
  year,
];

export const yearTermStreamsQueryKey = (
  year?: string,
  termId?: string,
): QueryKey => ["year-term-streams", year || "", termId || ""];
