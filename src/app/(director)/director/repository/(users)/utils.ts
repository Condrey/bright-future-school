import { QueryKey } from "@tanstack/react-query";

export const yearClassStreamsQueryKey = (year: string): QueryKey => [
  "year-class-streams",
  year,
];

export const yearTermStreamsQueryKey = (
  year: string,
  classTermId: string,
): QueryKey => ["year-term-streams", year, classTermId];
