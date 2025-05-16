import LoginImage from "@/assets/login-image.jpg";
import { webName } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Login",
};
export default async function Page() {
  return (
    <main className="flex min-h-dvh items-center p-5">
      <div className="bg-card mx-auto flex h-full max-h-[40rem] w-full max-w-sm overflow-hidden rounded-xl shadow-2xl lg:max-w-[64rem]">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <h1 className="text-3xl font-bold">{`Login to ${webName}`}</h1>
          <div className="space-y-5">
            {/* <GoogleSignInButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div> */}
            <LoginForm />
            {/* TODO: I think we do not need sign up in this use-case  */}
            {/* <Link
              href={`/signup`}
              className="block text-center hover:underline"
            >
              {`Don't have an account? SignUp`}
            </Link> */}
          </div>
        </div>

        <Image
          src={LoginImage}
          alt=""
          className="bg-foreground hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
