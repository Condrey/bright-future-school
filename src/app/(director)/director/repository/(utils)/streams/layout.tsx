import { webName } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: `%s | Streams - Utility Repository - Director | ${webName} Management System`,
    absolute: ` Streams - Utility Repository - Director | ${webName} Management System`,
    default: ` Streams - Utility Repository - Director | ${webName} Management System`,
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
