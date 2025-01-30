"use client";
import { useEffect, useState } from "react";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false; // default value during SSR
  });

  useEffect(() => {
    if (typeof window === "undefined") return; // Exit if window is not available

    const mediaQueryList = window.matchMedia(query);

    const updateMatches = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener("change", updateMatches);
    setMatches(mediaQueryList.matches); // Initial check

    return () => {
      mediaQueryList.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
