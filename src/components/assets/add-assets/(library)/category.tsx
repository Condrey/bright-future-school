import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/assets/add-assets/barrel-file";
import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import TipTapEditorWithHeader from "@/components/tip-tap-editor/tip-tap-editor-with-header";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  libraryAssetCategorySchema,
  LibraryAssetCategorySchema,
  LibraryAssetSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LibraryBookCategory as ItemCategory } from "@prisma/client";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import {
  createLibraryAssetCategory,
  getAllLibraryAssetCategory,
} from "./action";

interface CategoryProps {
  form: UseFormReturn<LibraryAssetSchema>;
}

export default function Category({ form }: CategoryProps) {
  const [open, setOpen] = useState(false);
  const watchedCategory = form.watch("category");
  const form2 = useForm<LibraryAssetCategorySchema>({
    resolver: zodResolver(libraryAssetCategorySchema),
    values: {
      category: watchedCategory?.category || "",
      description: watchedCategory?.description || "",
      id: watchedCategory?.id || "",
    },
  });

  const queryKey: QueryKey = ["categories", "list"];
  const { data, error, status, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: getAllLibraryAssetCategory,
    staleTime: Infinity,
  });

  if (status === "error") {
    console.error(error);
  }

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createLibraryAssetCategory,
    async onSuccess(newCategory) {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<ItemCategory[]>(
        queryKey,
        (oldData) => oldData && [newCategory, ...oldData],
      );
    },
    onError(error) {
      console.error(error);
      toast({
        description: "error creating category, try again.!",
        variant: "destructive",
      });
    },
  });

  function onSubmit(input: LibraryAssetCategorySchema) {
    mutation.mutate(input, {
      onSuccess(newCategory) {
        form.setValue("category", newCategory as LibraryAssetCategorySchema);
        setOpen(false);
      },
    });
  }

  return (
    <>
      {status === "pending" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="max-w-sm text-center text-muted-foreground">
            Loading....
          </span>
          <Loader2 className="animate-spin" />
        </div>
      ) : status === "error" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="max-w-sm text-center text-muted-foreground">
            Error fetching categories
          </span>
          <LoadingButton
            loading={isFetching}
            onClick={() => refetch()}
            className="w-fit"
          >
            Refresh
          </LoadingButton>
        </div>
      ) : status === "success" && !data.length ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="max-w-sm text-center text-muted-foreground">
            There are no categories in the system yet.
          </span>
        </div>
      ) : (
        <FormField
          control={form.control}
          name="category.id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
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
                        ? data.find((item) => item.id === field.value)?.category
                        : "Select category"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[24rem] max-w-md p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search categories..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {data.map((category) => (
                          <CommandItem
                            value={category.id}
                            key={category.id}
                            onSelect={() => {
                              field.onChange(category.id);
                              form.setValue(
                                "category",
                                category as LibraryAssetCategorySchema,
                              );
                            }}
                          >
                            <div className="flex flex-col">
                              <span>{category.category}</span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto",
                                category.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
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
      <Button
        className="mx-auto w-full max-w-fit"
        variant={"secondary"}
        type="button"
        onClick={() => setOpen(true)}
      >
        + Add new category
      </Button>
      <ResponsiveDrawer open={open} setOpen={setOpen} title="Add category">
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form2.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g Encyclopedia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form2.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <TipTapEditorWithHeader
                      onTextChanged={field.onChange}
                      initialContent={field.value}
                      placeholder="description about the category"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end">
              <LoadingButton
                loading={mutation.isPending}
                type="button"
                onClick={() => form2.handleSubmit(onSubmit)()}
              >
                Submit
              </LoadingButton>
            </div>
          </div>
        </Form>
      </ResponsiveDrawer>
    </>
  );
}
