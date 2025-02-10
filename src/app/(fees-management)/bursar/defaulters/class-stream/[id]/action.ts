"use server";

import { getStreamPupils } from "@/components/school-fees/action";
import { PupilData } from "@/lib/types";

export async function getDefaultedStudents({
  feesAmount,
  classStreamId,
  classTermId,
}: {
  feesAmount: number;
  classStreamId: string;
  classTermId: string;
}) {
  const students = await getStreamPupils({ classStreamId, classTermId });

  const defaultedStudents = students
    .map((s) => {
      const paid = s.fees
        .flatMap((f) => f.feesPayments.flatMap((p) => p.amountPaid))
        .reduce((total, amount) => total + amount, 0);
      const balance = feesAmount - paid;
      return balance > 0 ? s : undefined;
    })
    .filter(Boolean) as PupilData[];

  return defaultedStudents;
}
