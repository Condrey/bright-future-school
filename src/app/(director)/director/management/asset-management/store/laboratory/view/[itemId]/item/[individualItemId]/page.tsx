import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import { getIndividualLaboratoryItem } from "../../action";
import ItemBody from "./item-body";

interface PageProps {
  params: Promise<{ individualItemId: string }>;
}

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
          { label: "Asset management", url: "/management/asset-management/" },
          {
            label: "Laboratory Assets",
            url: `/management/asset-management/store/${AssetCategory.LABORATORY.toLocaleLowerCase()}`,
          },
          {
            label: `${individualItem.labItem.name} variants `,
            url: `/management/asset-management/store/${AssetCategory.LABORATORY.toLocaleLowerCase()}/view/${individualItem.labItemId}`,
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
