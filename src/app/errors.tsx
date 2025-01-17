"use client";

interface ErrorProps {
  error: Error;
}

export default function Page({ error }: ErrorProps) {
  // Modify the interface
  return <div>{error.message}</div>;
}
