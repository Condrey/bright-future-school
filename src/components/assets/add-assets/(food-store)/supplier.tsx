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
  Textarea,
} from "@/components/assets/add-assets/barrel-file";
import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  FoodStoreAssetSchema,
  supplierSchema,
  SupplierSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Supplier as ItemSupplier } from "@prisma/client";
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
  createFoodStoreAssetSupplier,
  getAllFoodStoreAssetSuppliers,
} from "./action";

interface SupplierProps {
  form: UseFormReturn<FoodStoreAssetSchema>;
}

export default function Supplier({ form }: SupplierProps) {
  const [open, setOpen] = useState(false);
  const watchedSupplier = form.watch("supplier");
  const form2 = useForm<SupplierSchema>({
    resolver: zodResolver(supplierSchema),
    values: {
      address: watchedSupplier?.address || "",
      name: watchedSupplier?.name || "",
      contactInfo: watchedSupplier?.contactInfo || "",
      id: watchedSupplier?.id || "",
    },
  });

  const queryKey: QueryKey = ["suppliers", "list"];
  const { data, error, status, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: getAllFoodStoreAssetSuppliers,
    staleTime: Infinity,
  });

  if (status === "error") {
    console.error(error);
  }

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createFoodStoreAssetSupplier,
    async onSuccess(newSupplier) {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<ItemSupplier[]>(
        queryKey,
        (oldData) => oldData && [newSupplier, ...oldData],
      );
    },
    onError(error) {
      console.error(error);
      toast({
        description: "error creating supplier, try again.!",
        variant: "destructive",
      });
    },
  });

  function onSubmit(input: SupplierSchema) {
    mutation.mutate(input, {
      onSuccess(newSupplier) {
        form.setValue("supplier", newSupplier as SupplierSchema);
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
            Error fetching suppliers
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
            There are no suppliers in the system yet.
          </span>
        </div>
      ) : (
        <FormField
          control={form.control}
          name="supplier.id"
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
                        : "Select supplier"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[24rem] max-w-md p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search suppliers..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No supplier found.</CommandEmpty>
                      <CommandGroup>
                        {data.map((supplier) => (
                          <CommandItem
                            value={supplier.id}
                            key={supplier.id}
                            onSelect={() => {
                              field.onChange(supplier.id);
                              form.setValue(
                                "supplier",
                                supplier as SupplierSchema,
                              );
                            }}
                          >
                            <div className="flex flex-col">
                              <span>{supplier.name}</span>
                              <p className="text-xs text-muted-foreground">
                                {supplier.address}, {supplier.contactInfo}
                              </p>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto",
                                supplier.id === field.value
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
        + Add new supplier
      </Button>
      <ResponsiveDrawer open={open} setOpen={setOpen} title="Add supplier">
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form2.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="supplier name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form2.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact information</FormLabel>
                  <FormControl>
                    <Input placeholder="contact number or email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form2.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea cols={5} placeholder="address" {...field} />
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
