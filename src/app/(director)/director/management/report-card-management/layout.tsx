import { webName } from "@/lib/utils";
import { Metadata } from "next";
import { getAllClassStreams } from "./action";
import ListOfClassStreams from "./stream/[classStreamId]/list-of-class-streams";

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
      <ListOfClassStreams classStreams={classStreams} />
      <div>{children}</div>
    </div>
  );
}
