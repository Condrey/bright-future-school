'use server'

import prisma from "@/lib/prisma";
import { verifyUserSchema, VerifyUserSchema } from "@/lib/validation";
import { generateEmailVerificationToken } from "../../email-verification/[token]/token";
import { sendEmailVerificationLink } from "../../email-verification/[token]/email";
import { redirect } from "next/navigation";


export async function verifyEmail(email:string,userId:string){

}
export async function verifyUser(input:VerifyUserSchema){
    const {email,id,name,telephone,username} = verifyUserSchema.parse(input)
    const token = await generateEmailVerificationToken(id)
await prisma.$transaction(async (tx)=>{
    await sendEmailVerificationLink({email,token})
    await tx.user.update({
        where:{id},
        data:{
            email,name,telephone,username
        }
    })
})
    redirect('/email-verification/')
}

