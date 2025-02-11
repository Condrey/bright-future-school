import { AssetRepairPaymentData } from "@/lib/types";
import { countryCurrency } from "@/lib/utils";
import {
  assetRepairPaymentSchema,
  AssetRepairPaymentSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetCategory, AssetDamage } from "@prisma/client";
import { useForm } from "react-hook-form";
import LoadingButton from "../loading-button";
import { NumberInput } from "../number-input/number-input";
import ResponsiveDrawer from "../responsive-drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useUpsertAssetRepairPayment } from "./mutation";

interface FormAddEditAssetPaymentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  assetRepairPaymentToEdit?: AssetRepairPaymentData;
  assetDamage: AssetDamage;
  assetCategory: AssetCategory;
}

const FormAddEditAssetPayment = ({
  open,
  setOpen,
  assetRepairPaymentToEdit,
  assetDamage,
  assetCategory,
}: FormAddEditAssetPaymentProps) => {
  const form = useForm<AssetRepairPaymentSchema>({
    resolver: zodResolver(assetRepairPaymentSchema),
    values: {
      assetDamageId: assetRepairPaymentToEdit?.assetDamageId || assetDamage.id,
      isSchoolCost:
        assetRepairPaymentToEdit?.isSchoolCost || assetDamage.isSchoolCost,
      paidAmount: assetRepairPaymentToEdit?.paidAmount!,
      userId: assetRepairPaymentToEdit?.userId || "",
      id: assetRepairPaymentToEdit?.id || "",
    },
  });
  const mutation = useUpsertAssetRepairPayment(assetCategory);

  function handleSubmit(input: AssetRepairPaymentSchema) {
    mutation.mutate(
      { input },
      {
        onSuccess() {
          setOpen(false);
        },
      },
    );
  }

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={`${assetRepairPaymentToEdit ? "Add" : "Update"} asset repair payment`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="paidAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount paid</FormLabel>
                <FormControl>
                  <NumberInput {...field} suffix={countryCurrency} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end">
            <LoadingButton loading={mutation.isPending}>
              {assetRepairPaymentToEdit ? "Create" : "Update"} payment
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
};

export default FormAddEditAssetPayment;
