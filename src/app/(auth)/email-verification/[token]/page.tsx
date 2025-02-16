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
  const [{ token }, cookieStore] = await Promise.all([params, cookies()]);

  if (!token || token === "undefined") {
    return <div>Email verification sent</div>;
  }
  const user = await scrapeUser(token);
  if (!user) throw new Error("User not found");
  const { id: userId, role, email } = user;
  try {
    const session = await lucia.createSession(userId, {
      role: role || Role.USER,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    redirect("/");
  } catch (e) {
    console.error(error);
  }

  async function handleEmailResend() {
    "use server";
  }

  return (
    <>
      <form action={handleEmailResend}>
        <Button>Resend Verification Link</Button>
        <Input id="email" value={email!} disabled />
      </form>
    </>
  );
}
