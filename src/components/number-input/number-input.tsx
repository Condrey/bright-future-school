import { Input } from "@/components/ui/input"; // Adjust the path as needed
import { cn } from "@/lib/utils";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import "./style.css";

interface NumberInputProps<T extends FieldValues>
  extends UseControllerProps<T> {
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  postChange?: (value: number) => void;
}

export function NumberInput<T extends FieldValues>({
  min,
  max,
  step = 1,
  className = "",
  placeholder = "0",
  prefix,
  suffix,
  disabled = false,
  postChange,
  ...props
}: NumberInputProps<T>) {
  const { field } = useController(props);

  return (
    <div className="relative">
      {prefix && (
        <span className="absolute text-muted-foreground left-2 top-1/2 -translate-y-1/2">
          {prefix}
        </span>
      )}
      <Input
        type="number"
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={cn(
          `ps-${prefix ? 12 : 4}`,
          `pe-${suffix ? 12 : 4}`,
          "no-caret",
          className
        )}
        placeholder={placeholder}
        value={field.value ?? undefined}
        onChange={(e) => {
          const value = e.target.value;
          const parsedValue = value === "" ? "" : Number(value);

          field.onChange(parsedValue);
          if (postChange) {
            postChange(value === "" ? 0 : Number(value));
          }
        }}
        onBlur={field.onBlur}
        name={field.name}
        ref={field.ref}
      />

      {suffix && (
        <span className="absolute text-muted-foreground right-2 top-1/2 -translate-y-1/2">
          {suffix}
        </span>
      )}
    </div>
  );
}
