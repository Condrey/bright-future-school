'use server'

import prisma from "@/lib/prisma";
import { gradingSchema, GradingSchema } from "@/lib/validation";
import { cache } from "react";

async function grading(){
     const gradingS = await prisma.grading.findMany({
       orderBy: { from: "asc" },
     });
     return gradingS
}
export const getAllGrading = cache(grading)

export async function upsertGrading(input:GradingSchema){
    const {id,from,to,grade,remarks,} = gradingSchema.parse(input)
    const grading = await prisma.grading.upsert({
        where:{id},
        create:{
            from,to,grade,remarks,
        },
        update:{
            from,to,grade,remarks,
        }
    });
    return grading;
}

export async function deleteGrading(id:string){
    const grading = await prisma.grading.delete({
        where:{id}
    });
    return grading;
}