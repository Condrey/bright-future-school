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
import { ItemSchema, itemSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AssetCondition,
  AssetItemStatus,
  ComputerLabItem,
} from "@prisma/client";
import cuid from "cuid";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAddMultipleItemMutation,
  useAddSingleItemMutation,
} from "./mutation";

interface ButtonAddTemProps {
  lastIndex: number;
  computerLabItem: ComputerLabItem;
}

export default function ButtonAddItem({
  lastIndex,
  computerLabItem,
}: ButtonAddTemProps) {
  const [open, setOpen] = useState(false);
  const singleItemMutation = useAddSingleItemMutation(computerLabItem);
  const multipleItemMutation = useAddMultipleItemMutation(computerLabItem);

  const form = useForm<ItemSchema>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      parentId: computerLabItem.id,
      quantity: undefined,
    },
  });
  function handleFormSubmit(input: ItemSchema) {
    multipleItemMutation.mutate(input);
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
                computerLabItemId: computerLabItem.id,
                condition: AssetCondition.NEW,
                status: AssetItemStatus.AVAILABLE,
                uniqueIdentifier: null,
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
            <Button className="rounded-l-none" size={"icon"}>
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
              render={(field) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <NumberInput
                      name={"quantity"}
                      placeholder="enter quantity here..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton loading={multipleItemMutation.isPending}>
              Add items
            </LoadingButton>
          </form>
        </Form>
      </ResponsiveDrawer>
    </>
  );
}
