"use client";

import LoadingButton from "@/components/loading-button";
import TooltipContainer from "@/components/tooltip-container";
import { assetCategories, assetItemStatuses, assetUnits } from "@/lib/enums";
import { GeneralStoreItemData } from "@/lib/types";
import {
  AssetSchema,
  generalStoreAssetSchema,
  GeneralStoreAssetSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetCategory, AssetItemStatus, AssetUnit } from "@prisma/client";
import { useForm } from "react-hook-form";
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
} from "../../barrel-file";
import AssetSection from "../asset-section";
import Asset from "./asset";
import ListOfGeneralStoreItems from "./list-of-general-store-items";
import { useGeneralStoreMutation } from "./mutation";

interface FormGeneralStoreProps {
  generalStoreItemToEdit?: GeneralStoreItemData;
}

export default function FormGeneralStore({
  generalStoreItemToEdit,
}: FormGeneralStoreProps) {
  const form = useForm<GeneralStoreAssetSchema>({
    resolver: zodResolver(generalStoreAssetSchema),
    values: {
      asset: (generalStoreItemToEdit?.asset as AssetSchema) || {
        id: "general-Store",
        category: AssetCategory.GENERAL_STORE,
        description: assetCategories[AssetCategory.GENERAL_STORE].explanation,
        name: assetCategories[AssetCategory.GENERAL_STORE].label,
      },
      id: generalStoreItemToEdit?.id || "",
      name: generalStoreItemToEdit?.name || "",
      quantity: generalStoreItemToEdit?.quantity!,
      trackQuantity: generalStoreItemToEdit?.trackQuantity || false,
      unit: generalStoreItemToEdit?.unit || AssetUnit.PIECE,
      status: generalStoreItemToEdit?.status || AssetItemStatus.AVAILABLE,
    },
  });
  const mutation = useGeneralStoreMutation();
  const handleSubmit = (input: GeneralStoreAssetSchema) => {
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
                  <CardTitle>Asset information</CardTitle>
                  <CardDescription>
                    General store items may fall under different assets. Specify
                    it here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="asset"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset</FormLabel>
                        <Asset form={form} />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card className="space-y-4">
                <CardHeader className="bg-muted/30">
                  <CardTitle>Item information</CardTitle>
                  <CardDescription>General store asset item</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., School bus" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
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
                              <SelectLabel>Store item status </SelectLabel>
                              {Object.values(AssetItemStatus).map((value) => {
                                const label = assetItemStatuses[value];
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
                  <div className="flex flex-col items-start space-y-4 rounded-md border p-4 shadow">
                    <FormField
                      control={form.control}
                      name="trackQuantity"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                                  {!form.getValues("name")
                                    ? "this item"
                                    : form.getValues("name")}
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
                      {`${!generalStoreItemToEdit ? "Submit" : "Update"}`} item
                    </LoadingButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
      <div className="ms-auto hidden w-full max-w-md xl:flex">
        <ListOfGeneralStoreItems />
      </div>
    </div>
  );
}
