import { buttonVariants } from "@/components/ui/button";
import { webName } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-dvh">
      <div className="m-auto flex max-w-5xl flex-col gap-5">
        <span>Welcome to {webName}</span>
        <Link href={`/director?level=all`} className={buttonVariants()}>
          Director
        </Link>
      </div>
    </div>
  );
}
