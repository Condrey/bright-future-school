import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import { getIndividualLaboratoryItem } from "@/components/assets/laboratory/view/action";
import ItemBody from "@/components/assets/laboratory/view/item/item-body";
import { assetCategories } from "@/lib/enums";

interface PageProps {
  params: Promise<{ individualItemId: string }>;
}
const assetCategory = AssetCategory.LABORATORY;
const category = assetCategories[assetCategory];
export default async function Page({ params }: PageProps) {
  const { individualItemId } = await params;
  const individualItem = await getIndividualLaboratoryItem(
    decodeURIComponent(individualItemId),
  );
  if (!individualItem) throw Error("Missing item.");
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: `${category.label} management`,
            url: "/laboratory-asset-management",
          },
          {
            label: `${individualItem.labItem.name} variants `,
            url: `/laboratory-asset-management/view/${individualItem.labItemId}`,
          },
          {
            label:
              individualItem.uniqueIdentifier || "Unknown unique Identifier",
          },
        ]}
      />
      <BodyContainer>
        <ItemBody oldItem={individualItem} />
      </BodyContainer>
    </Fragment>
  );
}
