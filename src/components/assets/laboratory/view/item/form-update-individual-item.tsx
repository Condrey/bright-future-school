"use client";

import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assetConditions, assetStatuses } from "@/lib/enums";
import { IndividualLaboratoryItemData } from "@/lib/types";
import {
  IndividualLaboratorySchema,
  individualLaboratorySchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetCondition, AssetStatus } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useUpdateIndividualItem } from "./mutation";

interface FormUpdateIndividualItemProps {
  individualItemToEdit: IndividualLaboratoryItemData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormUpdateIndividualItem({
  individualItemToEdit,
  open,
  setOpen,
}: FormUpdateIndividualItemProps) {
  const form = useForm<IndividualLaboratorySchema>({
    resolver: zodResolver(individualLaboratorySchema),
    values: {
      id: individualItemToEdit.id || "",
      labItemId: individualItemToEdit.labItemId || "",
      condition: individualItemToEdit.condition || AssetCondition.NEW,
      status: individualItemToEdit.status || AssetStatus.AVAILABLE,
      uniqueIdentifier: individualItemToEdit.uniqueIdentifier || "",
    },
  });
  const { mutate, isPending } = useUpdateIndividualItem();

  function handleFormSubmission(input: IndividualLaboratorySchema) {
    mutate(input, {
      onSuccess() {
        setOpen(false);
      },
    });
  }

  return (
    <ResponsiveDrawer
      title={`Update this ${individualItemToEdit.labItem.name}`}
      setOpen={setOpen}
      open={open}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmission)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="uniqueIdentifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unique Identifier</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter unique identifier here..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Library item condition </SelectLabel>
                      {Object.values(AssetCondition).map((value) => {
                        const label = assetConditions[value];
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
                      {Object.values(AssetStatus).map((value) => {
                        const label = assetStatuses[value];
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
          <div className="flex items-center justify-end gap-3">
            <LoadingButton loading={isPending}>Update</LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
