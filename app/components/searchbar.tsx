import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="py-4 px-4 bg-[#1B1B1B] text-[#39ff14] rounded-[30px] flex items-center">
      <input
        type="text"
        placeholder="Search user"
        className="bg-transparent outline-none text-[#39ff14] placeholder-[#9D9D9D] w-full pr-2"
      />
      <div className="w-[1px] h-5 bg-[#7D7D7D] mr-3" />
      <button>
        <Search className="w-5 h-5 text-[#9D9D9D] mr-3" />
      </button>
    </div>
  );
}
