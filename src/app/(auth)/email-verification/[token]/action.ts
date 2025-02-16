"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sendEmailVerificationLink } from "../../user-verification/[userId]/email";
import { sendWelcomeRemarksEmail } from "./email";
import { generateEmailVerificationToken } from "./token";

export async function resendEmailVerificationLink(
  email: string,
): Promise<{ error: string | null }> {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { error: "User with email not found" };
    }
    const token = await generateEmailVerificationToken(user.id);
    await sendEmailVerificationLink({ email, token });
    return { error: null };
  } catch (error) {
    console.error(error);
    return {
      error:
        "Error occurred while resending email verification link, please try again.",
    };
  }
}

export async function checkIsEmailVerified(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user?.emailVerified;
}

export async function sendWelcomingRemarks(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found.");
  if (!user.isWelcomed) {
    await sendWelcomeRemarksEmail({ email, name: user.name! });
  }
  const [updatedUser, session] = await Promise.all([
    prisma.user.update({
      where: { email },
      data: {
        isWelcomed: true,
      },
    }),
    lucia.createSession(user.id, {
      role: user.role || Role.USER,
    }),
  ]);
  const cookieStore = await cookies();
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  redirect("/");
}
