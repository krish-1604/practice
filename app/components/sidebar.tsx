"use client";
export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-[#1A1A1A] text-[#39ff14] p-4 rounded-r-[20px] shadow-lg z-40">
      <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
      <ul className="space-y-2">
        <li>
          <a href="/dashboard" className="hover:text-white">Home</a>
        </li>
        <li>
          <a href="/search" className="hover:text-white">Search</a>
        </li>
      </ul>
    </div>
  );
}
