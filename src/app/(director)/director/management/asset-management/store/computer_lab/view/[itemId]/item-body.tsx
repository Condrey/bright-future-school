'use client'

import { ComputerLabItemData, IndividualComputerLabItemData } from "@/lib/types"
import { QueryKey, useQuery } from "@tanstack/react-query"
import { getIndividualComputerLabItem } from "./action";import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


 interface ItemBodyProps {
    oldItem: IndividualComputerLabItemData
}

export default function ItemBody({ oldItem }: ItemBodyProps) {
  const queryKey: QueryKey = ["assets", "computer-lab-asset", "item", oldItem.id];

  const {data:item,status,error,refetch,isFetching} = useQuery({
    queryKey,
    queryFn: async()=>getIndividualComputerLabItem(oldItem.id),
    initialData: oldItem,
  });
  if(status==='error'){
    console.error(error)
    return <div className="flex flex-col gap-4 items-center justify-center size-full" >
      <span></span>
    </div>
  }
  if(!item){
    return <div></div>
  }
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{item.computerLabItem.name}</CardTitle>
          <CardDescription>{item.computerLabItem.model}</CardDescription>
        </CardHeader>
        <CardContent>
          <TipTapViewer content={item.computerLabItem.specification} />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}