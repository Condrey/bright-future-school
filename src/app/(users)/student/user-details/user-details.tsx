"use client";
import { PupilData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../action";
import MainContent from "./main-content";
import SideBarDetails from "./side-bar-details";

interface UserDetailsProps {
  oldPupil: PupilData;
}

export default function UserDetails({ oldPupil }: UserDetailsProps) {
  const { data, error, refetch, status } = useQuery({
    queryKey: ["pupil", oldPupil.id],
    queryFn: getUser,
    initialData: oldPupil,
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex min-h-[20rem] flex-col items-center justify-center">
        <span className="text-muted-foreground max-w-sm text-center">
          Error occurred while fetching this pupil
        </span>
      </div>
    );
  }
  if (status === "success" && !data) {
    return (
      <div className="flex min-h-[20rem] flex-col items-center justify-center">
        <span className="text-muted-foreground max-w-sm text-center">
          Pupil not found
        </span>
      </div>
    );
  }
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[80rem] gap-6 px-4 py-6">
      <div className="flex-1">
        <MainContent pupil={data} />
      </div>
      <div className="bg-card flex h-full min-w-[20rem] rounded-md border p-4">
        <SideBarDetails pupil={data} />
      </div>
    </div>
  );
}
