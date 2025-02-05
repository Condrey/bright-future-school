import { webName } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: `%s | Utility Repository - Director | ${webName} Management System`,
    absolute: `Utility Repository - Director | ${webName} Management System`,
    default: `Utility Repository - Director | ${webName} Management System`,
  },
  description:
    "A place for directors to handle utility Repository which includes academic year, classes, terms, steams, and so much more.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex size-full flex-col space-y-2">{children}</div>;
}
