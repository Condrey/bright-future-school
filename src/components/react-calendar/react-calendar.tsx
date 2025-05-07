"use client";

import { cn } from "@/lib/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./stylesheets/datepicker.scss";
import { Input } from "../ui/input";

export type ReactCalendarProps = React.ComponentProps<typeof DatePicker>;

function ReactCalendar({ className, ...props }: ReactCalendarProps) {
  return (
    <DatePicker
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      calendarIconClassName="top-1/2 -translate-y-1/2 text-muted-foreground absolute"
      {...props}
    />
  );
}
ReactCalendar.displayName = "ReactCalendar";
export { ReactCalendar };
