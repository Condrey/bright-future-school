import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { FieldValues, UseControllerProps } from "react-hook-form";

interface PasswordInputProps<T extends FieldValues>
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "defaultValue" | "name"
    >,
    UseControllerProps<T> {}

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps<any>
>(({ className, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pe-10", className)}
        ref={ref}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        title={`${showPassword ? "hide" : "show"} password`}
        className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
      >
        {showPassword ? (
          <EyeOff className="size-5" />
        ) : (
          <Eye className="size-5" />
        )}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";
export { PasswordInput };
