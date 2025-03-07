"use client";

import LoadingButton from "@/components/loading-button";
import TipTapEditorWithHeader from "@/components/tip-tap-editor/tip-tap-editor-with-header";
import TooltipContainer from "@/components/tooltip-container";
import { assetCategories, assetUnits } from "@/lib/enums";
import { ComputerLabItemData } from "@/lib/types";
import {
  AssetSchema,
  computerLabAssetSchema,
  ComputerLabAssetSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetCategory, AssetUnit } from "@prisma/client";
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
} from "@/components/assets/add-assets/barrel-file";
import AssetSection from "../asset-section";
import ListOfComputerLabItems from "./list-of-computer-lab-items";
import {
  useAddComputerLabMutation,
  useUpdateComputerLabMutation,
} from "./mutation";

interface FormComputerLabProps {
  computerLabItemToEdit?: ComputerLabItemData;
}

export default function FormComputerLab({
  computerLabItemToEdit,
}: FormComputerLabProps) {
  const form = useForm<ComputerLabAssetSchema>({
    resolver: zodResolver(computerLabAssetSchema),
    values: {
      asset: (computerLabItemToEdit?.asset as AssetSchema) || {
        id: "computer-Lab",
        category: AssetCategory.COMPUTER_LAB,
        description: assetCategories[AssetCategory.COMPUTER_LAB].explanation,
        name: assetCategories[AssetCategory.COMPUTER_LAB].label,
      },
      id: computerLabItemToEdit?.id || "",
      name: computerLabItemToEdit?.name || "",
      model: computerLabItemToEdit?.model || "",
      specification: computerLabItemToEdit?.specification || "",
      quantity: computerLabItemToEdit?.quantity!,
      trackQuantity: computerLabItemToEdit?.trackQuantity || true,
      unit: computerLabItemToEdit?.unit || AssetUnit.PIECE,
    },
  });
  const mutation = useAddComputerLabMutation();
  const updateMutation = useUpdateComputerLabMutation();
  function onSuccess() {
    form.reset();
  }
  const handleSubmit = (input: ComputerLabAssetSchema) => {
    !computerLabItemToEdit
      ? mutation.mutate(input, {
          onSuccess,
        })
      : updateMutation.mutate(input, { onSuccess });
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
                  <CardDescription>Computer lab asset item</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., monitor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Model</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., DELL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="specification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specification</FormLabel>
                        <FormControl>
                          <TipTapEditorWithHeader
                            onTextChanged={field.onChange}
                            initialContent={field.value}
                            placeholder={`e.g.,- 24" Monitor, P2419H, Full HD 1080p, Black Color
                          `}
                          />
                        </FormControl>
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

                  {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
                  <div className="flex w-full items-center justify-end">
                    <LoadingButton
                      loading={mutation.isPending}
                      className="ms-auto w-fit"
                    >
                      {`${!computerLabItemToEdit ? "Submit" : "Update"}`} item
                    </LoadingButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
      <div className="ms-auto hidden w-full max-w-md xl:flex">
        <ListOfComputerLabItems />
      </div>
    </div>
  );
}
