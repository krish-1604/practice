import Dashboard from "./dashboard/page";

export const generateMetadata = () => ({
  title: "Home - User Dashboard",
  description: "This is the home page of your app.",
  robots: {
      index: true,
      follow: true,
      nocache: false,
    },
  siteName: "Dashboard",
  type: "website",
});

export default function Home() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}
