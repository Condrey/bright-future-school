"use client";

import LoadingButton from "@/components/loading-button";
import TooltipContainer from "@/components/tooltip-container";
import { assetCategories, assetItemStatuses, assetUnits } from "@/lib/enums";
import { LaboratoryItemData } from "@/lib/types";
import {
  AssetSchema,
  laboratoryAssetSchema,
  LaboratoryAssetSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AssetCategory,
  AssetItemStatus,
  AssetStatus,
  AssetUnit,
} from "@prisma/client";
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
import ListOfLabItems from "./list-of-lab-items";
import { useLaboratoryMutation } from "./mutation";

interface FormLaboratoryProps {
  laboratoryItemToEdit?: LaboratoryItemData;
}

export default function FormLaboratory({
  laboratoryItemToEdit,
}: FormLaboratoryProps) {
  const form = useForm<LaboratoryAssetSchema>({
    resolver: zodResolver(laboratoryAssetSchema),
    defaultValues: {
      asset: (laboratoryItemToEdit?.asset as AssetSchema) || {
        id: "laboratory",
        category: AssetCategory.LABORATORY,
        description: assetCategories[AssetCategory.LABORATORY].explanation,
        name: assetCategories[AssetCategory.LABORATORY].label,
      },
      id: laboratoryItemToEdit?.id || "",
      name: laboratoryItemToEdit?.name || "",
      quantity: laboratoryItemToEdit?.quantity!,
      trackQuantity: laboratoryItemToEdit?.trackQuantity || false,
      unit: laboratoryItemToEdit?.unit || AssetUnit.PIECE,
      status: laboratoryItemToEdit?.status || AssetStatus.AVAILABLE,
    },
  });
  const mutation = useLaboratoryMutation();
  const handleSubmit = (input: LaboratoryAssetSchema) => {
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
                  <CardDescription>Laboratory asset item</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Blue litmus paper"
                            {...field}
                          />
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
                              <SelectLabel>Lab item status </SelectLabel>
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
                                    litmus paper, chalk, e.t.c
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
                      Submit item
                    </LoadingButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
      <div className="ms-auto hidden w-full max-w-md xl:flex">
        <ListOfLabItems />
      </div>
    </div>
  );
}
