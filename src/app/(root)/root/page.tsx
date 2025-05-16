import RoleSwitcher from "@/components/switchers/role-switcher";

export default function Page() {
  return (
    <div className="flex size-full min-h-svh flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-bold">System Root user</h1>
      <p className="italic">Open as:</p>
      <div className="bg-accent mx-auto w-full max-w-sm rounded-md">
        <RoleSwitcher />
      </div>
    </div>
  );
}
