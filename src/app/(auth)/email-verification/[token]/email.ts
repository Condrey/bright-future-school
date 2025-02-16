
export const sendEmailVerificationLink = async ({email,token}:{email:string,token:string})=>{
    const url = process.env.NEXT_PUBLIC_BASE_URL+'email-verification/'+token;
   try {
    await sendEmail(email,{
        //TODO: complete,
            })
   } catch (error) {
    console.error(error)
    throw new Error('Failed to send verification link.')
   }
}