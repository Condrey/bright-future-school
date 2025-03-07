import { lucia } from "@/auth";
import { validateEmailVerificationToken } from "./token";
import { error } from "console";
import { Button } from "@/components/ui/button";
import { User } from "lucia";
import { Input } from "@/components/ui/input";
import prisma from "@/lib/prisma";
import { cache } from "react";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import EmailVerificationForm from "./email-verification-form";
import { checkIsEmailVerified } from "./action";

interface PageProps {
  params: Promise<{ token: string }>;
}

async function scrapeUser(token: string) {
  const userId = await validateEmailVerificationToken(token);
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      isVerified: true,
      emailVerified: true,
    },
  });
  return user;
}

export const metadata: Metadata = {
  title: "Email verification",
};
export default async function Page({ params }: PageProps) {
  const { token: encodedToken } = await params;
  const token = decodeURIComponent(encodedToken);

  if (!token || token.startsWith("token")) {
    const email = decodeURIComponent(token.split("-")[1]);
    return <EmailVerificationForm email={email} />;
  }
  const user = await scrapeUser(token);
  if (!user) throw new Error("User not found");
  const { email } = user;

  return <EmailVerificationForm email={email!} />;
}
