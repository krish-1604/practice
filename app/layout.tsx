import "./globals.css";
import { UserProvider } from "./context/userContext";
import Sidebar from "./components/sidebar";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "User Dashboard",
  description: "Manage your users efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        <UserProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="ml-64 flex-1 h-screen overflow-y-auto relative">
              <ClientLayout>
                {children}
              </ClientLayout>
            </main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
