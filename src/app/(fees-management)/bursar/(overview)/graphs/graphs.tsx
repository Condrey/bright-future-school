import prisma from "@/lib/prisma";
import PaymentsByClass from "./payments-by-class";
import { getYearTermFeesManagementSummary } from "@/app/(director)/director/management/fees-management/action";

export default async function Graphs() {
  const [paymentsByClass] = await Promise.all([
    await getYearTermFeesManagementSummary({
      year: `${new Date().getFullYear()}`,
      termId: undefined,
    }),
  ]);


  return (
    <div>
      <PaymentsByClass data={paymentsByClass} />
    </div>
  );
}

export function GraphsFallback() {
  return <div>Loading</div>;
}
