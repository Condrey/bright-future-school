import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Metadata } from "next";
import { Fragment, Suspense } from "react";
import Borrowings from "./borrowings";
import TableSummary, { TableSummaryFallback } from "./table-summary";

export const metadata: Metadata = {
  title: "Borrowings and lendings",
};

export default function Page() {
  const assetCategory = AssetCategory.LIBRARY;
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: "Asset management",
            url: `/management/asset-management/`,
          },
          {
            label: assetCategories[assetCategory].label + "s",
            url: `/management/asset-management/store/${assetCategory.toLocaleLowerCase()}`,
          },
          { label: "Borrowings" },
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
