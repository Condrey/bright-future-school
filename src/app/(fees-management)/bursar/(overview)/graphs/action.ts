"use server";

import { getYearTermFeesManagementSummary } from "@/components/school-fees/action";
import prisma from "@/lib/prisma";
import { getYear } from "date-fns";
import { cache } from "react";

const fetchPaymentsByClass = async (year?: string, termId?: string) => {
  const [terms, term] = await Promise.all([
    getYearTermFeesManagementSummary({
      year: year ? year : undefined,
      termId: termId ? termId : undefined,
    }),
    termId
      ? prisma.term.findFirstOrThrow({
          where: { id: termId },
        })
      : Promise.resolve(null),
  ]);

  return { terms, term };
};
export const getPaymentsByClass = cache(fetchPaymentsByClass);

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
