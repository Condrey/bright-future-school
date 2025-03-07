'use client'

import { DataTable } from "@/components/ui/data-table"
import { ClassStreamData } from "@/lib/types"
import { useClassStreamColumns } from "./(tables)/columns"

interface ListOfClassStreamsProps{
    classStreams:ClassStreamData[]
}

export default function ListOfClassStreams({classStreams}:ListOfClassStreamsProps){
    return <div>
        <DataTable data={classStreams} columns={useClassStreamColumns}
filterColumn={{id:'class_class_name',label:'class'}}
ROWS_PER_TABLE={10}
        />
    </div>
}