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
import { AssetData } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  assetSchema,
  AssetSchema,
  GeneralStoreAssetSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetCategory } from "@prisma/client";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { createAsset, getAllAssets } from "./action";

interface AssetProps {
  form: UseFormReturn<GeneralStoreAssetSchema>;
}

export default function Asset({ form }: AssetProps) {
  const [open, setOpen] = useState(false);
  const watchedAsset = form.watch("asset");
  const form2 = useForm<AssetSchema>({
    resolver: zodResolver(assetSchema),
    values: {
      name: watchedAsset?.name || "",
      description: watchedAsset?.description || "",
      category: watchedAsset.category || AssetCategory.GENERAL_STORE,
      id: watchedAsset?.id || "",
    },
  });

  const queryKey: QueryKey = ["categories", "list"];
  const { data, error, status, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: getAllAssets,
    staleTime: Infinity,
  });

  if (status === "error") {
    console.error(error);
  }

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createAsset,
    async onSuccess(newAsset) {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<AssetData[]>(
        queryKey,
        (oldData) => oldData && [newAsset, ...oldData],
      );
    },
    onError(error) {
      console.error(error);
      toast({
        description: "error creating asset, try again.!",
        variant: "destructive",
      });
    },
  });

  function onSubmit(input: AssetSchema) {
    mutation.mutate(input, {
      onSuccess(newAsset) {
        form.setValue("asset", newAsset as AssetSchema);
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
            There are no asset categories in the system yet.
          </span>
        </div>
      ) : (
        <FormField
          control={form.control}
          name="asset.id"
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
                        ? data.find((item) => item.id === field.value)?.name
                        : "Select asset"}
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
                      <CommandEmpty>No asset found.</CommandEmpty>
                      <CommandGroup>
                        {data.map((asset) => (
                          <CommandItem
                            value={asset.id}
                            key={asset.id}
                            onSelect={() => {
                              field.onChange(asset.id);
                              form.setValue("asset", asset as AssetSchema);
                            }}
                          >
                            <div className="flex flex-col">
                              <span>{asset.name}</span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto",
                                asset.id === field.value
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
        + Add new asset
      </Button>
      <ResponsiveDrawer open={open} setOpen={setOpen} title="Add asset">
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form2.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g Football equipments" {...field} />
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
                      placeholder="description about the asset"
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
