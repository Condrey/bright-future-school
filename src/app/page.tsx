import { validateRequest } from "@/auth";
import { buttonVariants } from "@/components/ui/button";
import { roleRedirectPaths } from "@/lib/enums";
import { cn, webName } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();

  if (user) redirect(roleRedirectPaths[user.role]);

  return (
    <div className="flex size-full min-h-svh flex-col items-center justify-center gap-12">
      <div className="mx-auto flex max-w-md flex-col gap-0.5">
        <h1 className="text-center text-2xl font-bold tracking-tight uppercase lg:text-3xl">
          {webName}
        </h1>
        <h4 className="text-center italic">school management system</h4>
      </div>
      <Link
        href={`/login`}
        className={cn(buttonVariants({ className: "w-full max-w-sm" }))}
      >
        Login
      </Link>
    </div>
  );
}
