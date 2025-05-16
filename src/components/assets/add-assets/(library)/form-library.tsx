"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  NumberInput,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/assets/add-assets/barrel-file";
import LoadingButton from "@/components/loading-button";
import TooltipContainer from "@/components/tooltip-container";
import { assetCategories, assetUnits } from "@/lib/enums";
import { LibraryBookData } from "@/lib/types";
import {
  AssetSchema,
  LibraryAssetCategorySchema,
  libraryAssetSchema,
  LibraryAssetSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetCategory, AssetUnit } from "@prisma/client";
import { useForm } from "react-hook-form";
import AssetSection from "../asset-section";
import Category from "./category";
import ListOfLibraryItems from "./list-of-library-items";
import { useLibraryMutation } from "./mutation";

interface FormLibraryProps {
  libraryItemToEdit?: LibraryBookData;
}

export default function FormLibrary({ libraryItemToEdit }: FormLibraryProps) {
  const form = useForm<LibraryAssetSchema>({
    resolver: zodResolver(libraryAssetSchema),
    values: {
      asset: (libraryItemToEdit?.asset as AssetSchema) || {
        id: "library",
        category: AssetCategory.LIBRARY,
        description: assetCategories[AssetCategory.LIBRARY].explanation,
        name: assetCategories[AssetCategory.LIBRARY].label,
      },
      category: libraryItemToEdit?.category! as LibraryAssetCategorySchema,
      id: libraryItemToEdit?.id || "",
      title: libraryItemToEdit?.title || "",
      author: libraryItemToEdit?.author || "",
      quantity: libraryItemToEdit?.quantity!,
      trackQuantity: libraryItemToEdit?.trackQuantity || true,
      unit: libraryItemToEdit?.unit || AssetUnit.PIECE,
    },
  });
  const mutation = useLibraryMutation();
  const handleSubmit = (input: LibraryAssetSchema) => {
    mutation.mutate(input, {
      onSuccess() {
        form.reset();
      },
    });
  };
  return (
    <div className="flex max-w-[95rem] gap-4">
      <div className="w-full max-w-5xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4 md:flex-row"
          >
            <div className="flex flex-col gap-4 md:w-1/3">
              <AssetSection form={form} />
            </div>
            <div className="flex-1 space-y-4 md:w-2/3">
              <Card className="space-y-4">
                <CardHeader className="bg-muted/30">
                  <CardTitle>Item information</CardTitle>
                  <CardDescription>Library asset item</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Things Fall Apart"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="the author of the book..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="isbn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ISBN</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="book ISBN, optional "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Category form={form} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Library status </SelectLabel>
                              {Object.values(BookStatus).map((value) => {
                                const label = bookStatuses[value];
                                return (
                                  <SelectItem key={value} value={value}>
                                    <span>{label}</span>
                                  </SelectItem>
                                );
                              })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <div className="flex flex-col items-start space-y-4 rounded-md border p-4 shadow">
                    <FormField
                      control={form.control}
                      name="trackQuantity"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                          <FormControl>
                            <Checkbox
                              id="checkbox"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <div className="flex items-start">
                              <FormLabel htmlFor="checkbox">
                                Track item quantity
                              </FormLabel>
                              <TooltipContainer label="">
                                <span>
                                  Whether or not{" "}
                                  {!form.getValues("title")
                                    ? "this item"
                                    : form.getValues("title")}
                                  's quantity should be tracked.{" "}
                                  <strong className="font-bold">
                                    Some items do not need tracking, e.g.,
                                    school keys, School sign post, e.t.c
                                  </strong>
                                </span>
                              </TooltipContainer>
                            </div>

                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    {form.watch("trackQuantity") && (
                      <div className="flex gap-3">
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <NumberInput
                                  placeholder="quantity of item ..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Unit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Asset units</SelectLabel>
                                    {Object.values(AssetUnit).map((value) => {
                                      const label = assetUnits[value];
                                      return (
                                        <SelectItem key={value} value={value}>
                                          <span>{label}</span>
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                  {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
                  <div className="flex w-full items-center justify-end">
                    <LoadingButton
                      loading={mutation.isPending}
                      className="ms-auto w-fit"
                    >
                      {`${!libraryItemToEdit ? "Submit" : "Update"}`} item
                    </LoadingButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
      <div className="ms-auto hidden w-full max-w-md xl:flex">
        <ListOfLibraryItems />
      </div>
    </div>
  );
}
