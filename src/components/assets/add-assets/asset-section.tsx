import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/assets/add-assets/barrel-file";
import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import { assetCategories } from "@/lib/enums";
import { AssetSchema } from "@/lib/validation";
import { AssetCategory } from "@prisma/client";
import { FileQuestionIcon, LucideIcon } from "lucide-react";
import { FieldValues, UseFormReturn } from "react-hook-form";

interface AssetSectionProps<T extends FieldValues> {
  form: UseFormReturn<T>;
}

export default function AssetSection<T extends { asset: AssetSchema }>({
  form,
}: AssetSectionProps<T>) {
  const formValues = form.watch();
  console.log(formValues);

  const Icon: LucideIcon = !formValues.asset
    ? FileQuestionIcon
    : assetCategories[formValues.asset.category as AssetCategory].icon;
  const label = !formValues.asset
    ? ""
    : assetCategories[formValues.asset.category as AssetCategory].label;

  return (
    <div>
      <Card className="bg-muted/30">
        <CardHeader className="flex-row items-center justify-center">
          <div className="bg-border flex size-44 items-center justify-center rounded-full border p-2">
            <Icon className="size-36" strokeWidth={0.5} />
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle>{formValues.asset.name}</CardTitle>
          <CardDescription>{label}</CardDescription>
        </CardContent>
        <CardFooter>
          <div>
            <TipTapViewer content={formValues.asset.description} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
