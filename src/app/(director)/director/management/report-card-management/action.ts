'use server'

import prisma from "@/lib/prisma"
import { classStreamDataInclude } from "@/lib/types"
import { cache } from "react";

export async function classStreams(){
    const data = await prisma.classStream.findMany({
        include:classStreamDataInclude
    })
    return data;
}
export const getAllClassStreams = cache(classStreams)

export async function classStreamById(id:string){
const data = await prisma.classStream.findFirst({where:{id:{equals:id,mode:"insensitive"}},include:classStreamDataInclude})
return data;
}
export const getClassStreamById = cache(classStreamById)