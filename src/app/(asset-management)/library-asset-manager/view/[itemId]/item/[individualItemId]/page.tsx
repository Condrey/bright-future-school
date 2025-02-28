import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import { getIndividualBook } from "@/components/assets/library/view/action";
import ItemBody from "@/components/assets/library/view/item/item-body";
import { assetCategories } from "@/lib/enums";

interface PageProps {
  params: Promise<{ individualItemId: string }>;
}
const assetCategory = AssetCategory.LIBRARY;
const category = assetCategories[assetCategory];

export default async function Page({ params }: PageProps) {
  const { individualItemId } = await params;
  const individualItem = await getIndividualBook(
    decodeURIComponent(individualItemId),
  );
  if (!individualItem) throw Error("Missing item.");
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: `${category.label} management`,
            url: "",
          },
          {
            label: `${individualItem.libraryBook.author}'s ${individualItem.libraryBook.title} books `,
            url: `/view/${individualItem.libraryBookId}`,
          },
          {
            label: individualItem.isbn || "Unknown ISBN",
          },
        ]}
      />
      <BodyContainer>
        <ItemBody oldItem={individualItem} />
      </BodyContainer>
    </Fragment>
  );
}
