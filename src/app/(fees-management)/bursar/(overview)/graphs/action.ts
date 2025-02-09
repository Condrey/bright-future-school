"use server";

import { getYearTermFeesManagementSummary } from "@/app/(director)/director/management/fees-management/action";
import prisma from "@/lib/prisma";
import { getYear } from "date-fns";

export const getPaymentsByClass = async (year?: string, termId?: string) => {
  const [terms, term] = await Promise.all([
    await getYearTermFeesManagementSummary({
      year: !year ? undefined : (year as string),
      termId: !termId ? undefined : (termId as string),
    }),
    !termId
      ? undefined
      : await prisma.term.findFirstOrThrow({
          where: { id: termId as string },
        }),
  ]);
  return { terms, term: term! };
};

export async function getYearlyPayments() {
  const data = await prisma.feesPayment.findMany({
    select: { amountPaid: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  const groupedData: {
    [key: number]: { totalAmountPaid: number; paymentCount: number };
  } = {};
  data.map((payment) => {
    const year = getYear(payment.createdAt);
    if (!groupedData[year]) {
      groupedData[year] = { totalAmountPaid: 0, paymentCount: 0 };
    }
    groupedData[year].totalAmountPaid += payment.amountPaid;
    groupedData[year].paymentCount += 1;
  });
  return Object.entries(groupedData).map(
    ([year, { totalAmountPaid, paymentCount }]) => ({
      year: parseInt(year),
      totalAmountPaid,
      paymentCount,
    }),
  );
}
export async function getGraphData(year?: string, termId?: string) {
  const [paymentsByClass, yearlyPayments] = await Promise.all([
    await getPaymentsByClass(year, termId),
    await getYearlyPayments(),
  ]);

  return { paymentsByClass, yearlyPayments };
}
