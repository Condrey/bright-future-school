import SignUpImage from "@/assets/signup-image.webp";
import { webName } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./signup-form";
export const metadata: Metadata = {
  title: "Sign up",
};
export default function Page() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-5">
      <div className="bg-card flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-xl shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">{`Sign into ${webName}`}</h1>
            <p className="text-muted-foreground">school motto here </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href={`/login`} className="block text-center hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </div>
        <Image
          src={SignUpImage}
          alt=""
          className="bg-foreground hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
