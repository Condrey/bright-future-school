import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/assets/add-assets/barrel-file";
import LoadingButton from "@/components/loading-button";
import UserAvatar from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { BorrowerSchema } from "@/lib/validation";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Fragment } from "react";
import { UseFormReturn } from "react-hook-form";
import { getPotentialBorrowers } from "./action";

interface FormBorrowersProps {
  isAStaff: boolean;
  form: UseFormReturn<BorrowerSchema>;
}

export default function FormBorrowers({ form, isAStaff }: FormBorrowersProps) {
  const queryKey: QueryKey = ["book-borrowers", "list"];
  const { data, error, status, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: getPotentialBorrowers,
    staleTime: Infinity,
  });

  if (status === "error") {
    console.error(error);
  }

  return (
    <>
      {status === "pending" ? (
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground max-w-sm text-center">
            fetching potential borrower list....
          </span>
          <Loader2 className="animate-spin" />
        </div>
      ) : status === "error" ? (
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground max-w-sm text-center">
            Error fetching potential borrowers.
          </span>
          <LoadingButton
            loading={isFetching}
            onClick={() => refetch()}
            className="w-fit"
          >
            Refresh
          </LoadingButton>
        </div>
      ) : status === "success" && !data ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground max-w-sm text-center">
            There are no potential borrowers in the system yet.
          </span>
        </div>
      ) : (
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Damaged by</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      type="button"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? isAStaff
                          ? data.staffs.find(
                              (item) => item.user?.id === field.value,
                            )?.user?.name
                          : data.pupils.find(
                              (item) => item.user?.id === field.value,
                            )?.user?.name
                        : "Select person"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[24rem] max-w-md p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search person..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>
                        {isAStaff
                          ? "No staff found"
                          : "No pupil/ student found."}
                      </CommandEmpty>
                      <CommandGroup>
                        {isAStaff ? (
                          <Fragment>
                            {data.staffs.map(({ user: person }) => {
                              if (!person) return null;

                              return (
                                <CommandItem
                                  value={person.name!}
                                  key={person.id}
                                  onSelect={() => {
                                    field.onChange(person.id);
                                    form.setValue("userId", person.id);
                                  }}
                                >
                                  <div className="flex gap-2">
                                    <UserAvatar avatarUrl={person.avatarUrl} />
                                    <div className="flex flex-col">
                                      <span>{person.name}</span>
                                      <p className="text-xs tracking-tight">
                                        {person.telephone ||
                                          person.email ||
                                          `@${person.username}`}
                                      </p>
                                    </div>
                                  </div>
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      person.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              );
                            })}
                          </Fragment>
                        ) : (
                          <Fragment>
                            {data.pupils.map(
                              ({ user: person, classStreams }) => {
                                if (!person) return null;
                                const classStream =
                                  classStreams[classStreams.length - 1];

                                return (
                                  <CommandItem
                                    value={person.name!}
                                    key={person.id}
                                    onSelect={() => {
                                      field.onChange(person.id);
                                      form.setValue("userId", person.id);
                                    }}
                                  >
                                    <div className="flex gap-2">
                                      <UserAvatar
                                        avatarUrl={person.avatarUrl}
                                      />
                                      <div className="flex flex-col">
                                        <span>{person.name}</span>
                                        <p className="text-xs tracking-tight">
                                          {person.telephone ||
                                            person.email ||
                                            `@${person.username}`}
                                        </p>
                                        <span className="text-muted-foreground text-xs">
                                          {classStream?.class?.class?.name}{" "}
                                          class,
                                          {
                                            classStream?.class?.academicYear
                                              ?.year
                                          }
                                          ,
                                          {
                                            classStream?.class?.class?.level
                                              ?.name
                                          }
                                        </span>
                                      </div>
                                    </div>
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        person.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                );
                              },
                            )}
                          </Fragment>
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
