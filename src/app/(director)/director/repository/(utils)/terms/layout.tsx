import { webName } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: `%s | Terms - Utility Repository - Director | ${webName} Management System`,
    absolute: ` Terms - Utility Repository - Director | ${webName} Management System`,
    default: ` Terms - Utility Repository - Director | ${webName} Management System`,
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
