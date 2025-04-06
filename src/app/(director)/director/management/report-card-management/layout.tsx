import { webName } from "@/lib/utils";
import { Metadata } from "next";
import { getAllClassStreams } from "./action";
import Sidebar from "./side-bar";

export const metadata: Metadata = {
  title: {
    template: `%s | Report card Management - Director | ${webName} Management System`,
    absolute: `Report card Management - Director | ${webName} Management System`,
    default: `Report card Management - Director | ${webName} Management System`,
  },
  description:
    "A place for directors to handle report card management for pupils/ students",
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const classStreams = await getAllClassStreams();

  return (
    <div className="flex w-full flex-row gap-4 px-4 py-6">
      <div className="flex-1">{children}</div>
      <Sidebar
        classStreams={classStreams}
        className="sticky top-10 hidden max-h-[75vh] w-full max-w-fit flex-col space-y-2 overflow-y-auto scroll-smooth rounded-md border bg-card p-4 xl:flex"
      />
    </div>
  );
}
