import { assetConditions } from "@/app/(director)/director/management/asset-management/add-asset/barrel-file";
import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import TipTapEditorWithHeader from "@/components/tip-tap-editor/tip-tap-editor-with-header";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AssetDamageData } from "@/lib/types";
import { assetDamageSchema, AssetDamageSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetCondition } from "@prisma/client";
import { useForm } from "react-hook-form";
import FormDamagedBy from "./form-damaged-by";
import { useAddItemDamage, useUpdateItemDamage } from "./mutation";

interface FormAddEditDamageProps {
  parentId: string;
  damageToEdit?: AssetDamageData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditDamage({
  parentId,
  damageToEdit,
  open,
  setOpen,
}: FormAddEditDamageProps) {
  const form = useForm<AssetDamageSchema>({
    resolver: zodResolver(assetDamageSchema),
    defaultValues: {
      id: damageToEdit?.id || "",
      condition: damageToEdit?.condition || AssetCondition.DAMAGED,
      damageDetails: damageToEdit?.damageDetails || "",
      isRepaired: damageToEdit?.isRepaired || false,
      quantity: damageToEdit?.quantity || 1,
      userId: damageToEdit?.userId || "",
      parentId: damageToEdit?.individualFoodStoreItemId || parentId,
    },
  });
  const addMutation = useAddItemDamage();
  const updateMutation = useUpdateItemDamage();
  function onSuccess() {
    form.reset();
    setOpen(false);
  }
  function handleFormSubmit(input: AssetDamageSchema) {
    !damageToEdit
      ? addMutation.mutate(input, { onSuccess })
      : updateMutation.mutate(input, { onSuccess });
  }

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={damageToEdit ? "Update damage" : "Register new damage record"}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <FormDamagedBy form={form} />

          <FormField
            control={form.control}
            name="damageDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Damage details</FormLabel>
                <FormControl>
                  <TipTapEditorWithHeader
                    onTextChanged={field.onChange}
                    initialContent={field.value}
                    placeholder="describe the damages here..."
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
                      <SelectLabel>Food store item condition </SelectLabel>
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
          <div className="flex items-center justify-end gap-4">
            <LoadingButton
              loading={addMutation.isPending || updateMutation.isPending}
            >
              {!damageToEdit ? "Register" : "Update"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
