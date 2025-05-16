"use client";

import { useGetAllLevelsQuery } from "@/components/levels/level/hooks";
import LoadingButton from "@/components/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { levelSchema, LevelSchema, SubjectSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm, UseFormReturn } from "react-hook-form";

interface FormAddEditLevelProps {
  form: UseFormReturn<SubjectSchema>;
}

export default function FormAddEditLevel({ form }: FormAddEditLevelProps) {
  const form2 = useForm<LevelSchema>({
    resolver: zodResolver(levelSchema),
    defaultValues: {
      id: form.getValues("levelId") || "",
      name: "",
    },
  });
  const { status, data, refetch, isRefetching } = useGetAllLevelsQuery();

  return (
    <Form {...form2}>
      <div>
        {status === "pending" ? (
          <div className="text-muted-foreground flex items-center gap-1">
            <Loader2 className="size-4 animate-spin" />
            <span>Loading levels ...</span>
          </div>
        ) : status === "success" && !data.length ? (
          <p className="text-muted-foreground">
            There are no levels yet. Please add
          </p>
        ) : status === "error" ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-destructive text-center">
              An error occurred while fetching levels.
            </p>
            <LoadingButton
              loading={isRefetching}
              type="button"
              variant={"destructive"}
              onClick={() => refetch()}
            >
              Refetch
            </LoadingButton>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-2">
            <FormField
              control={form.control}
              name="levelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data.map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          <div>{level.name}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </Form>
  );
}
