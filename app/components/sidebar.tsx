export default function Sidebar() {
  return (
    <div className="bg-[#1A1A1A] text-[#39ff14] w-64 p-4 rounded-r-[20px] shadow-lg">
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