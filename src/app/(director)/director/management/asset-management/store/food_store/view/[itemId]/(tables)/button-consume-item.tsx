import { Button } from "@/components/ui/button";

import LoadingButton from "@/components/loading-button";
import { NumberInput } from "@/components/number-input/number-input";
import ResponsiveDrawer from "@/components/responsive-drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FoodConsumptionSchema, foodConsumptionSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useConsumeFoodStoreItemMutation } from "./mutation";
import { FoodStoreItemData } from "@/lib/types";
import { assetUnits } from "@/lib/enums";
import TipTapEditorWithHeader from "@/components/tip-tap-editor/tip-tap-editor-with-header";
export { NumberInput } from "@/components/number-input/number-input";

interface ButtonConsumeItemProps {
  foodStoreItem: FoodStoreItemData;
  isSecondary?: boolean
}

export default function ButtonConsumeItem({
  foodStoreItem,isSecondary=false
}: ButtonConsumeItemProps) {
  const [open, setOpen] = useState(false);
  const mutation = useConsumeFoodStoreItemMutation();
  const form = useForm<FoodConsumptionSchema>({
    resolver: zodResolver(foodConsumptionSchema),
    defaultValues: {
      foodStoreItemId: foodStoreItem.id,
      quantityUsed: undefined,
      usageDetails:''
    },
  });
  function handleFormSubmit(input: FoodConsumptionSchema) {
    mutation.mutate(input, {
      onSettled() {
        setOpen(false);
      },
    });
  }
  return (
    <>
      <Button
        variant={isSecondary ? "secondary" : "default"}
        disabled={mutation.isPending}
        onClick={() => setOpen(true)}
      >
        {isSecondary ? "Add consumption" : "Consume"}
      </Button>

      <ResponsiveDrawer
        open={open}
        setOpen={setOpen}
        title={`Consume this ${foodStoreItem.foodName}, food store item`}
        description="Enter the quantity to be consumed here below"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="quantityUsed"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Quantity({assetUnits[foodStoreItem.unit]}s)
                  </FormLabel>
                  <FormControl>
                    <NumberInput
                      placeholder="quantity of unit to consume"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usageDetails"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Usage details </FormLabel>
                  <FormControl>
                    <TipTapEditorWithHeader
                      onTextChanged={field.onChange}
                      initialContent={field.value}
                      placeholder="Optionally add usage details"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end">
              <LoadingButton loading={mutation.isPending}>
                Consume
              </LoadingButton>
            </div>
          </form>
        </Form>
      </ResponsiveDrawer>
    </>
  );
}
