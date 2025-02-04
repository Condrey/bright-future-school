"use client";

import LoadingButton from "@/components/loading-button";
import TooltipContainer from "@/components/tooltip-container";
import { assetCategories, assetItemStatuses, assetUnits } from "@/lib/enums";
import { FoodStoreItemData } from "@/lib/types";
import {
  AssetSchema,
  foodStoreAssetSchema,
  FoodStoreAssetSchema,
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
import ListOfFoodStoreItems from "./list-of-food-store-items";
import { useFoodStoreMutation } from "./mutation";
import Supplier from "./supplier";

interface FormFoodStoreProps {
  foodStoreItemToEdit?: FoodStoreItemData;
}

export default function FormFoodStore({
  foodStoreItemToEdit,
}: FormFoodStoreProps) {
  const form = useForm<FoodStoreAssetSchema>({
    resolver: zodResolver(foodStoreAssetSchema),
    defaultValues: {
      asset: (foodStoreItemToEdit?.asset as AssetSchema) || {
        id: "food-Store",
        category: AssetCategory.FOOD_STORE,
        description: assetCategories[AssetCategory.FOOD_STORE].explanation,
        name: assetCategories[AssetCategory.FOOD_STORE].label,
      },
      id: foodStoreItemToEdit?.id || "",
      foodName: foodStoreItemToEdit?.foodName || "",
      quantity: foodStoreItemToEdit?.quantity!,
      trackQuantity: foodStoreItemToEdit?.trackQuantity || false,
      unit: foodStoreItemToEdit?.unit || AssetUnit.PIECE,
      status: foodStoreItemToEdit?.status || AssetItemStatus.AVAILABLE,
    },
  });
  const mutation = useFoodStoreMutation();
  const handleSubmit = (input: FoodStoreAssetSchema) => {
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
                  <CardDescription>Food store asset item</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="foodName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., rice" {...field} />
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
                              <SelectLabel>Food store item status </SelectLabel>
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
                                  {!form.getValues("foodName")
                                    ? "this item"
                                    : form.getValues("foodName")}
                                  's quantity should be tracked.{" "}
                                  <strong className="font-bold">
                                    Some items do not need tracking.
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
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <Supplier form={form} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
                  <div className="flex w-full items-center justify-end">
                    <LoadingButton
                      loading={mutation.isPending}
                      className="ms-auto w-fit"
                    >
                      {`${!foodStoreItemToEdit ? "Submit" : "Update"}`} item
                    </LoadingButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
      <div className="ms-auto hidden w-full max-w-md xl:flex">
        <ListOfFoodStoreItems />
      </div>
    </div>
  );
}
