import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

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
import { LibraryBookData } from "@/lib/types";
import { ItemSchema, itemSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetCondition, BookStatus } from "@prisma/client";
import cuid from "cuid";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAddMultipleItemMutation,
  useAddSingleItemMutation,
} from "./mutation";
export { NumberInput } from "@/components/number-input/number-input";

interface ButtonAddTemProps {
  lastIndex: number;
  libraryItem: LibraryBookData;
}

export default function ButtonAddItem({
  lastIndex,
  libraryItem,
}: ButtonAddTemProps) {
  const [open, setOpen] = useState(false);
  const singleItemMutation = useAddSingleItemMutation(libraryItem);
  const multipleItemMutation = useAddMultipleItemMutation(libraryItem);

  const form = useForm<ItemSchema>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      parentId: libraryItem.id,
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
          loading={
            singleItemMutation.isPending || multipleItemMutation.isPending
          }
          className="rounded-r-none"
          onClick={() =>
            singleItemMutation.mutate({
              input: {
                id: cuid(),
                borrowCount: 0,
                libraryBookId: libraryItem.id,
                condition: AssetCondition.NEW,
                status: BookStatus.AVAILABLE,
                isbn: null,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            })
          }
        >
          +1 item
        </LoadingButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="rounded-l-none"
              size={"icon"}
              disabled={
                singleItemMutation.isPending || multipleItemMutation.isPending
              }
            >
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              Add multiple items
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ResponsiveDrawer
        open={open}
        setOpen={setOpen}
        title="Add multiple items"
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
            <div className="flex items-center justify-end">
              <LoadingButton loading={multipleItemMutation.isPending}>
                Add items
              </LoadingButton>
            </div>
          </form>
        </Form>
      </ResponsiveDrawer>
    </>
  );
}
