import prisma from "@/lib/prisma"
import VerificationForm from "./[userId]/verification-form"

interface PageProps{
    params: Promise<{userId:string}>
}
export default async function Page({params}:PageProps){
const {userId} = await params
const user = await prisma.user.findUnique({where:{id:userId}})
if(!user) throw new Error('User not found')
    return <div>
        <VerificationForm user={user}/>
    </div>
}