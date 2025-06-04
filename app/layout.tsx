"use client";

import "./globals.css";
import Sidebar from "./components/sidebar";
import Plus from "./components/plusbutton";
import Form from "./components/form";
import { useState, useEffect } from "react";
import { UserProvider } from "./context/userContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  return (
    <html lang="en">
      <body className="bg-black">
        <UserProvider>
          <div className="flex min-h-screen">
            <Sidebar/>
            <main className="ml-64 flex-1 h-screen overflow-y-auto relative">
              {children}
              {mounted && isModalOpen && (
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                  onClick={handleModalClose}
                >
                  <div
                    className="bg-[#1B1B1B] rounded-xl p-6 max-w-md w-full text-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Form onClose={handleModalClose} />
                  </div>
                </div>
              )}
            </main>
            <Plus onOpen={handleModalOpen} />
          </div>
        </UserProvider>
      </body>
    </html>
  );
}