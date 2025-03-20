"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import { Label } from "./ui/label";

interface TooltipContainerProps {
  children: React.ReactNode;
  className?: string;
  label: string;
}

export default function TooltipContainer({
  label,
  children,
  className,
}: TooltipContainerProps) {
  return (
    <Tooltip defaultOpen={false}>
      <TooltipTrigger
        type="button"
        className="flex h-fit items-center justify-start gap-2"
      >
        <Label className="line-clamp-1 block h-fit text-ellipsis py-1 break-words">
          {label}
        </Label>
        <InfoIcon
          className={cn("size-5 fill-primary text-primary-foreground")}
        />
      </TooltipTrigger>
      <TooltipContent
        align="start"
        className={cn(
          "flex h-fit min-h-fit max-w-sm flex-col text-sm",
          className,
        )}
      >
        {children}
      </TooltipContent>
    </Tooltip>
  );
}
