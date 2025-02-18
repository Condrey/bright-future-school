import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, PlusIcon } from "lucide-react";

import LoadingButton from "@/components/loading-button";
import { NumberInput } from "@/components/number-input/number-input";
import ResponsiveDrawer from "@/components/responsive-drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { assetUnits } from "@/lib/enums";
import { FoodStoreItemData } from "@/lib/types";
import { ItemSchema, itemSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAddMultipleItemMutation,
  useAddSingleItemMutation,
} from "./view/[itemId]/(tables)/mutation";
export { NumberInput } from "@/components/number-input/number-input";

interface ButtonAddTemProps {
  foodStoreItem: FoodStoreItemData;
  minify?: boolean;
}

export default function ButtonAddItem({
  foodStoreItem,
  minify = false,
}: ButtonAddTemProps) {
  const [open, setOpen] = useState(false);
  const singleItemMutation = useAddSingleItemMutation(foodStoreItem);
  const multipleItemMutation = useAddMultipleItemMutation(foodStoreItem);
  const unit = assetUnits[foodStoreItem.unit];
  const form = useForm<ItemSchema>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      parentId: foodStoreItem.id,
      quantity: undefined,
    },
  });
  function handleFormSubmit(input: ItemSchema) {
    multipleItemMutation.mutate(input, {
      onSettled() {
        setOpen(false);
      },
    });
  }
  return (
    <>
      <div className="flex items-center gap-0">
        <LoadingButton
          variant={"secondary"}
          size={minify ? "sm" : "default"}
          loading={
            singleItemMutation.isPending || multipleItemMutation.isPending
          }
          className="rounded-r-none"
          onClick={() =>
            singleItemMutation.mutate({
              foodStoreItemId: foodStoreItem.id,
            })
          }
        >
          {minify ? <PlusIcon className="size-4" /> : `+1 unit(${unit})`}
        </LoadingButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="rounded-l-none"
              variant={"secondary"}
              size={minify ? "sm" : "icon"}
              disabled={
                singleItemMutation.isPending || multipleItemMutation.isPending
              }
            >
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              Add multiple units({unit}s)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ResponsiveDrawer
        open={open}
        setOpen={setOpen}
        title="Add multiple unit quantities"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Quantity({unit}s)</FormLabel>
                  <FormControl>
                    <NumberInput
                      placeholder="unit quantity to be added"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end">
              <LoadingButton loading={multipleItemMutation.isPending}>
                Add
              </LoadingButton>
            </div>
          </form>
        </Form>
      </ResponsiveDrawer>
    </>
  );
}
