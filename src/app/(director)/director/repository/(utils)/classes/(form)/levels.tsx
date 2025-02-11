import LoadingButton from "@/components/loading-button";
import TooltipContainer from "@/components/tooltip-container";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClassSchema, levelSchema, LevelSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Level } from "@prisma/client";
import { CheckedState } from "@radix-ui/react-checkbox";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { CheckIcon, Loader2, PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { getLevelsAction } from "../../levels/action";
import { useAddLevelMutation } from "../../levels/mutation";

interface LevelsProps {
  form: UseFormReturn<ClassSchema>;
}

export default function Levels({ form }: LevelsProps) {
  const [showInputField, setShowInputField] = useState(false);

  const watchedLevel = form.watch("level");
  const queryKey: QueryKey = ["levels"];
  const mutation = useAddLevelMutation();

  const { status, data, refetch, isRefetching } = useQuery({
    queryKey: queryKey,
    queryFn: getLevelsAction,
  });

  const form2 = useForm<LevelSchema>({
    resolver: zodResolver(levelSchema),
    values: watchedLevel,
  });

  function removeInputField() {
    form2.reset();
    setShowInputField(false);
  }

  function handleForm2Submit(input: LevelSchema) {
    mutation.mutate(input, {
      onSuccess(data) {
        form.setValue("level", data as LevelSchema);
        removeInputField();
      },
    });
  }

  function handleCheckChange(level: Level, checked: CheckedState) {
    if (checked === true) {
      form.clearErrors("level");
      form.setValue("level", level as LevelSchema);
    } else {
      form.resetField("level");
    }
  }

  return (
    <div className="space-y-3">
      <TooltipContainer label="Level">
        <p>
          Every class should belong to a level, check it using the{" "}
          <strong className="font-bold">checkbox</strong>; a level where this
          particular class belongs to.
          <br />
          If a level you are looking for does not appear, create one using the{" "}
          <strong className="font-bold">Create new level</strong> button below.
        </p>
      </TooltipContainer>
      <FormMessage />
      {status === "pending" ? (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span>Loading levels ...</span>
        </div>
      ) : status === "success" && !data.length ? (
        <p className="text-muted-foreground">
          There are no levels yet. Please add
        </p>
      ) : status === "error" ? (
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-center text-destructive">
            An error occurred while fetching categories.
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
          {data.map((level) => (
            <div key={level.id} className="flex items-center gap-2">
              <Checkbox
                name={level.id}
                id={level.id}
                checked={watchedLevel?.id === level.id || false}
                onCheckedChange={(checked) => {
                  handleCheckChange(level, checked);
                }}
              />
              <Label htmlFor={level.id} className="line-clamp-1 py-1">
                {level.name}
              </Label>
            </div>
          ))}
        </div>
      )}
      {showInputField && (
        <Form {...form2}>
          <div>
            <FormField
              control={form2.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-row items-center gap-1">
                      <Checkbox
                        checked
                        onCheckedChange={() => removeInputField()}
                      />
                      <Input {...field} placeholder="e.g., primary" />
                      <Button
                        onClick={removeInputField}
                        type="button"
                        variant={"destructive"}
                        size={"icon"}
                        className="flex-none"
                      >
                        <XIcon className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant={"secondary"}
                        size={"icon"}
                        disabled={!field.value}
                        onClick={() => form2.handleSubmit(handleForm2Submit)()}
                        className="flex-none"
                      >
                        <CheckIcon className="size-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      )}
      {!showInputField && (
        <Button
          type="button"
          variant="secondary"
          className="text-primary"
          onClick={() => setShowInputField(true)}
        >
          <PlusIcon className="mr-2 size-4" />
          <span>Create new level</span>
        </Button>
      )}
    </div>
  );
}
