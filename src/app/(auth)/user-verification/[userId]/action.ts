"use server";

import prisma from "@/lib/prisma";
import { verifyUserSchema, VerifyUserSchema } from "@/lib/validation";
import { generateEmailVerificationToken } from "../../email-verification/[token]/token";
import { sendEmailVerificationLink } from "./email";
import { redirect } from "next/navigation";
import { hash } from "@node-rs/argon2";

export async function verifyUser(input: VerifyUserSchema):Promise<{error:string|null}> {
  const { email, id, name, telephone, username ,password} =
    verifyUserSchema.parse(input);
  try {
    const token = await generateEmailVerificationToken(id);
    await sendEmailVerificationLink({ email, token });
 const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

   await prisma.$transaction(
    async (tx)=>{
      const userWithUsername = await tx.user.findUnique({
        where: { username },
      });
      if (!!userWithUsername) {
        return {error:'User name exists.'};
              }

      await tx.user.update({
        where: { id },
        data: {
          email,
          name,
          telephone,
          username,
          passwordHash:!!password?passwordHash:{}
        },
      });
    }
   )
  } catch (error) {
    console.error("User verification Error: ", error);
    throw new Error("Failed to verify user");
  }
  redirect(`/email-verification/token-${email}`);
}
