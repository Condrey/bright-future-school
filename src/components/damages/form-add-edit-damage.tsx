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
import { assetConditions } from "@/lib/enums";
import { AssetDamageData } from "@/lib/types";
import { countryCurrency } from "@/lib/utils";
import { assetDamageSchema, AssetDamageSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetCategory, AssetCondition } from "@prisma/client";
import { useForm } from "react-hook-form";
import { NumberInput } from "../number-input/number-input";
import { Badge } from "../ui/badge";
import FormDamagedBy from "./form-damaged-by";
import { useAddItemDamage, useUpdateItemDamage } from "./mutation";

interface FormAddEditDamageProps {
  damagedByStudent: boolean;
  assetCategory: AssetCategory;
  parentId: string;
  damageToEdit?: AssetDamageData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditDamage({
  assetCategory,
  parentId,
  damageToEdit,
  open,
  setOpen,
  damagedByStudent,
}: FormAddEditDamageProps) {
  const categories: Record<
    AssetCategory,
    { parentId: string | null | undefined; label: string }
  > = {
    LIBRARY: {
      parentId: damageToEdit?.individualLabItemId,
      label: "Library",
    },
    COMPUTER_LAB: {
      parentId: damageToEdit?.individualComputerLabItemId,
      label: "Computer lab",
    },
    LABORATORY: {
      parentId: damageToEdit?.individualLabItemId,
      label: "Laboratory",
    },
    GENERAL_STORE: {
      parentId: damageToEdit?.individualGeneralStoreItemId,
      label: "General store",
    },
    FOOD_STORE: {
      parentId: damageToEdit?.individualFoodStoreItemId,
      label: "Food store",
    },
  };
  const currentCategoryValue = categories[assetCategory];

  const form = useForm<AssetDamageSchema>({
    resolver: zodResolver(assetDamageSchema),
    defaultValues: {
      id: damageToEdit?.id || "",
      condition: damageToEdit?.condition || AssetCondition.DAMAGED,
      damageDetails: damageToEdit?.damageDetails || "",
      isRepaired: damageToEdit?.isRepaired || false,
      quantity: damageToEdit?.quantity || 1,
      userId: damageToEdit?.userId!,
      parentId: currentCategoryValue.parentId || parentId,
      isSchoolCost: damageToEdit?.isSchoolCost || damagedByStudent,
      repairPrice: damageToEdit?.repairPrice!,
    },
  });
  const addMutation = useAddItemDamage(assetCategory);
  const updateMutation = useUpdateItemDamage(assetCategory);
  function onSuccess() {
    form.reset();
    setOpen(false);
  }
  function handleFormSubmit(input: AssetDamageSchema) {
    !damageToEdit
      ? addMutation.mutate({ input, assetCategory }, { onSuccess })
      : updateMutation.mutate({ input, assetCategory }, { onSuccess });
  }

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={damageToEdit ? "Update damage" : "Register new damage record"}
      description={`Cost of repair covered by ${damagedByStudent ? "pupil/ student" : "school"}`}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          {!damagedByStudent ? (
            <Badge variant={"go"}>School covered cost</Badge>
          ) : (
            <FormDamagedBy form={form} />
          )}

          <FormField
            control={form.control}
            name="repairPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Approximated repair cost</FormLabel>
                <FormControl>
                  <NumberInput {...field} suffix={countryCurrency} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      <SelectLabel>
                        {currentCategoryValue.label} asset condition{" "}
                      </SelectLabel>
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
