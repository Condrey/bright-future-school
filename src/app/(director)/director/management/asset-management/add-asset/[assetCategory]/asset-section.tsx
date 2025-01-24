import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import { AssetSchema } from "@/lib/validation";
import { AssetCategory } from "@prisma/client";
import { FileQuestionIcon, LucideIcon } from "lucide-react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import {
  assetCategories,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../barrel-file";

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
          <Icon
            className="size-44 rounded-full border bg-border p-2"
            strokeWidth={0.5}
          />
        </CardHeader>
        <CardContent>
          <CardTitle>{formValues.asset.name}</CardTitle>
          <CardDescription>{label}</CardDescription>
        </CardContent>
        <CardFooter>
          <TipTapViewer content={formValues.asset.description} />
        </CardFooter>
      </Card>
    </div>
  );
}
