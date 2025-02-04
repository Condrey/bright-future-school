import NavigationBar from "./navigation-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="flex w-full items-center justify-start px-4 pt-2 lg:px-6">
        <NavigationBar />
      </header>
      <div>{children}</div>
    </div>
  );
}
