"use server";

import { TermWithYearData } from "@/lib/types";
import { getPaymentsByClass } from "../../(overview)/graphs/action";

export async function fetchDefaulterList(year?: string, termId?: string) {
  const { terms } = await getPaymentsByClass(year);
  const pendingDues = terms
    .map((t) => {
      const feesAmount = t.feesAmount || 0;
      const pupilNumber = t.classStream?._count.pupils || 0;
      const totalFeesAmount = pupilNumber * feesAmount;

      const feesCollected =
        t.fees
          .flatMap((f) => f.feesPayments.flatMap((p) => p.amountPaid))
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

      const classTermId = t.id;
      const extraPayment =
        t.classStream?.pupils
          .map((p) => {
            const _totalAmountPaid =
              p.fees
                .flatMap((f) => {
                  let _feesPayments = 0;
                  if (f.term.id === classTermId) {
                    _feesPayments =
                      f.feesPayments.reduce(
                        (total, amount) =>
                          (total || 0) + (amount.amountPaid || 0),
                        0,
                      ) || 0;
                  }
                  return _feesPayments;
                })
                .reduce((total, amount) => (total || 0) + (amount || 0), 0) ||
              0;
            if (!feesAmount) return 0;
            if (feesAmount === 0) return 0;
            const _balance = feesAmount - _totalAmountPaid;
            if (_totalAmountPaid <= 0) return 0;
            return _balance < 0 ? -_balance : 0;
          })
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

      const dues = totalFeesAmount - feesCollected + extraPayment;
      return dues > 0 ? t : undefined;
    })
    .filter(Boolean) as TermWithYearData[];

  return pendingDues;
}
