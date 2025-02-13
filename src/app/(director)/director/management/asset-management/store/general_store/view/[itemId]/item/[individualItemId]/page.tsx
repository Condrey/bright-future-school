import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import { getIndividualGeneralStoreItem } from "../../action";
import ItemBody from "./item-body";

interface PageProps {
  params: Promise<{ individualItemId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { individualItemId } = await params;
  const individualItem = await getIndividualGeneralStoreItem(
    decodeURIComponent(individualItemId),
  );
  if (!individualItem) throw Error("Missing item.");
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          { label: "Asset management", url: "/management/asset-management/" },
          {
            label: "General Store Assets",
            url: `/management/asset-management/store/${AssetCategory.GENERAL_STORE.toLocaleLowerCase()}`,
          },
          {
            label: `${individualItem.generalStoreItem.name} variants `,
            url: `/management/asset-management/store/${AssetCategory.GENERAL_STORE.toLocaleLowerCase()}/view/${individualItem.generalStoreItemId}`,
          },
          {
            label:
              individualItem.uniqueIdentifier || "Unknown unique Identifier",
          },
        ]}
        className="max-w-[90rem]"
      />
      <BodyContainer className="max-w-[90rem]">
        <ItemBody oldItem={individualItem} />
      </BodyContainer>
    </Fragment>
  );
}
