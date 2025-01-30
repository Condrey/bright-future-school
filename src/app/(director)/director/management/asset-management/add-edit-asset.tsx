import LoadingButton from "@/components/loading-button";
import ResponsiveDrawer from "@/components/responsive-drawer";
import TipTapEditorWithHeader from "@/components/tip-tap-editor/tip-tap-editor-with-header";
import { AssetData } from "@/lib/types";
import { assetSchema, AssetSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetCategory } from "@prisma/client";
import { useForm } from "react-hook-form";
import {
  assetCategories,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./add-asset/barrel-file";
import { useAddAssetMutation, useUpdateAssetMutation } from "./mutation";

interface AddEditAssetProps {
  assetToEdit?: AssetData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddEditAsset({
  assetToEdit,
  open,
  setOpen,
}: AddEditAssetProps) {
  const form = useForm<AssetSchema>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      category: assetToEdit?.category,
      description: assetToEdit?.description || "",
      id: assetToEdit?.id || "",
      name: assetToEdit?.name || "",
    },
  });

  const addAssetMutation = useAddAssetMutation();
  const updateAssetMutation = useUpdateAssetMutation();
  function onSuccess() {
    setOpen(false);
  }
  function handleFormSubmit(input: AssetSchema) {
    assetToEdit
      ? updateAssetMutation.mutate(input, { onSuccess })
      : addAssetMutation.mutate(input, { onSuccess });
  }
  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={`${assetToEdit ? "Add" : "Update"} asset.`}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Physics practical apparatus"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The category for the lab item being added.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset name</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an asset category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(AssetCategory).map((value) => {
                      const Icon = assetCategories[value].icon;
                      const label = assetCategories[value].label;
                      return (
                        <SelectItem key={value} value={value}>
                          <div className="flex flex-row items-center">
                            <Icon className="mr-2 size-4" />
                            <span>{label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between gap-4">
                  <FormLabel>Description</FormLabel>
                </div>
                <FormControl>
                  <TipTapEditorWithHeader
                    initialContent={field.value}
                    placeholder="Give your asset a professional  description"
                    onTextChanged={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-4">
            <LoadingButton
              loading={
                addAssetMutation.isPending || updateAssetMutation.isPending
              }
            >
              {assetToEdit ? "Submit" : "Update"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
