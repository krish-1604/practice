"use client";

import { useState, useEffect } from "react";
import Form from "./components/form";
import Plus from "./components/plusbutton";


export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <>
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
      <Plus onOpen={handleModalOpen} />
    </>
  );
}
