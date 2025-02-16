"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { loginSchema, LoginValues } from "@/lib/validation";
import { verify } from "@node-rs/argon2";
import {
  REDIRECT_ERROR_CODE,
  RedirectType,
} from "next/dist/client/components/redirect-error";
import { RedirectStatusCode } from "next/dist/client/components/redirect-status-code";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  credentials: LoginValues,
): Promise<{ error: string }> {
  // try {
    const cookieStore = await cookies();
    console.log(credentials);
    const { username, password } = loginSchema.parse(credentials);

    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: "Incorrect username or password.",
      };
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      return {
        error: "Incorrect username or password.",
      };
    }

    const session = await lucia.createSession(existingUser.id, {
      role: existingUser.role || "USER",
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return redirect(
      existingUser.isVerified ? "/" : `/user-verification/${existingUser.id}`,
    );
  // } catch (error) {
  //   console.error(`Login error: ${error}`);
  //   return {
  //     error: "Something went wrong, Please try again.!",
  //   };
  // }
}

type RedirectError = Error & {
  digest: `${typeof REDIRECT_ERROR_CODE};${RedirectType};${string};${RedirectStatusCode};`;
};
declare function isRedirectError(error: unknown): error is RedirectError;
