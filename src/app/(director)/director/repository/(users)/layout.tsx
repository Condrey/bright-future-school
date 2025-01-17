import BannerContainer from "./banner-container";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-full flex-col space-y-2">
      <BannerContainer />
      {children}
    </div>
  );
}
