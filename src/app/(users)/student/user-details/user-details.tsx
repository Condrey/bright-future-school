'use client'
import { PupilData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../action";
import SideBarDetails from "./side-bar-details";
import MainContent from "./main-content";

 interface UserDetailsProps {
  oldPupil: PupilData;
}

export default function UserDetails({ oldPupil }: UserDetailsProps) {
  const {data,error,refetch,status} = useQuery({
    queryKey: ["pupil", oldPupil.id],
    queryFn: getUser,
    initialData:oldPupil
  });
  if(status==='error'){
console.error(error)
return <div className="flex flex-col items-center justify-center min-h-[20rem]">
  <span className="max-w-sm text-muted-foreground text-center">Error occurred while fetching this pupil</span>
</div>
  }
  if(status==='success' && !data){
    return <div className="flex flex-col items-center justify-center min-h-[20rem]">
      <span className="max-w-sm text-muted-foreground text-center">Pupil not found</span>
    </div>
  }
  return (
    <div className="flex w-full mx-auto max-w-[80rem] gap-6 px-4 py-6  min-h-dvh">
      <div className="flex-1">
        <MainContent pupil={data} />
      </div>
      <div className="border flex rounded-md h-full p-4 bg-card min-w-[20rem]">
        <SideBarDetails pupil={data} />
      </div>
    </div>
  );
}
