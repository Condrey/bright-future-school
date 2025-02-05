import { webName } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: `%s | Pupils and students | User Repository - Director | ${webName} Management System`,
    absolute: `Pupils and students | User Repository - Director | ${webName} Management System`,
    default: `Pupils and students | User Repository - Director | ${webName} Management System`,
  },
  description: `Management of pupils and or students of ${webName}`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
