"use client";

import LoadingButton from "@/components/loading-button";
import { NumberInput } from "@/components/number-input/number-input";
import { LabItemData } from "@/lib/types";
import {
  AssetSchema,
  laboratoryAssetSchema,
  LaboratoryAssetSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetCategory, AssetUnit, LabItemStatus } from "@prisma/client";
import { useForm } from "react-hook-form";
import {
  assetUnits,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  labItemStatuses,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../barrel-file";
import AssetSection from "./asset-section";

interface FormLaboratoryProps {
  laboratoryItemToEdit?: LabItemData;
}

export default function FormLaboratory({
  laboratoryItemToEdit,
}: FormLaboratoryProps) {
  const form = useForm<LaboratoryAssetSchema>({
    resolver: zodResolver(laboratoryAssetSchema),
    defaultValues: {
      asset: (laboratoryItemToEdit?.asset as AssetSchema) || {
        category: AssetCategory.LABORATORY,
        description: "",
        name: "",
      },
      id: laboratoryItemToEdit?.id || "",
      name: laboratoryItemToEdit?.name || "",
      quantity: laboratoryItemToEdit?.quantity!,
      unit: laboratoryItemToEdit?.unit || AssetUnit.PIECES,
      status: laboratoryItemToEdit?.status || LabItemStatus.AVAILABLE,
    },
  });
  const handleSubmit = (input: LaboratoryAssetSchema) => {};
  return (
    <div className="me-auto w-full max-w-5xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4 md:flex-row"
        >
          <Card className="flex-1 space-y-4 md:w-2/3">
            <CardHeader>
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
                      <Input placeholder="e.g. Blue litmus paper" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                          {Object.values(AssetUnit).map((value) => {
                            const label = assetUnits[value];
                            return (
                              <SelectItem key={value} value={value}>
                                <span>{label}</span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                        {Object.values(LabItemStatus).map((value) => {
                          const label = labItemStatuses[value];
                          return (
                            <SelectItem key={value} value={value}>
                              <span>{label}</span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4 md:w-1/3">
            <Card className="hidden md:flex">
              <CardHeader className="flex w-full items-center justify-end">
                <LoadingButton loading={false} className="ms-auto w-fit">
                  Submit item
                </LoadingButton>
              </CardHeader>
            </Card>
            <AssetSection form={form} />
          </div>
        </form>
      </Form>
    </div>
  );
}
