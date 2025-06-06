import Dashboard from "./dashboard/page";

export const generateMetadata = () => ({
  title: "Home - User Dashboard",
  description: "This is the home page of your app.",
});

export default function Home() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}
