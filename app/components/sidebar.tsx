import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-[#1A1A1A] text-[#39ff14] p-4 rounded-r-[20px] shadow-lg z-40">
      <Link href={"/"}>
        <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
      </Link>
      <ul className="space-y-2">
        <li>
          <Link href="/dashboard" className="hover:text-white">Home</Link>
        </li>
        <li>
          <Link href="/search" className="hover:text-white">Search</Link>
        </li>
      </ul>
    </div>
  );
}
