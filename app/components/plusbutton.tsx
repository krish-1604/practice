"use client";

interface PlusProps {
  onOpen: () => void;
}

export default function Plus({ onOpen }: PlusProps){
    return(
        <button className="fixed bottom-4 w-16 right-4 bg-[#39ff14] text-black p-4 rounded-[20px] shadow-lg hover:bg-[#32cc00] transition-colors duration-300 flex items-center justify-center text-2xl font-bold" onClick={onOpen}>
            +
        </button>
    );
}