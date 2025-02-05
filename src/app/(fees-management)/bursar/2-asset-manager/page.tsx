import { userRoles } from "@/lib/enums";
import { Role } from "@prisma/client";

export default function Page() {
  // TODO: implement this pages.
  return (
    <div>{`The ${userRoles[Role.COMPUTER_LAB_ASSET_CARETAKER].label}, not yet implemented`}</div>
  );
}
