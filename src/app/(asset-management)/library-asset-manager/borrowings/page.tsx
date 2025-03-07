import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Metadata } from "next";
import { Fragment, Suspense } from "react";
import TableSummary, {
  TableSummaryFallback,
} from "@/components/assets/library/borrowings/table-summary";
import Borrowings from "@/components/assets/library/borrowings/borrowings";

export const metadata: Metadata = {
  title: "Borrowings and lendings",
};

export default function Page() {
  const assetCategory = AssetCategory.LIBRARY;
  const category = assetCategories[assetCategory];

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: `${category.label} management`,
            url: "",
          },
          {
            label: "Library book borrowings",
          },
        ]}
      />
      <BodyContainer>
        <Suspense fallback={<TableSummaryFallback />}>
          <TableSummary />
        </Suspense>
        <Borrowings />
      </BodyContainer>
    </Fragment>
  );
}
