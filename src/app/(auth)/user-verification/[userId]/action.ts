"use server";

import prisma from "@/lib/prisma";
import { verifyUserSchema, VerifyUserSchema } from "@/lib/validation";
import { generateEmailVerificationToken } from "../../email-verification/[token]/token";
import { sendEmailVerificationLink } from "./email";
import { redirect } from "next/navigation";

export async function verifyUser(input: VerifyUserSchema) {
  const { email, id, name, telephone, username } =
    verifyUserSchema.parse(input);
  try {
    const token = await generateEmailVerificationToken(id);
    await sendEmailVerificationLink({ email, token });
    await prisma.user.update({
      where: { id },
      data: {
        email,
        name,
        telephone,
        username,
      },
    });
  } catch (error) {
    console.error("User verification Error: ", error);
    throw new Error("Failed to verify user");
  }
  redirect(`/email-verification/token-${email}`);
}
