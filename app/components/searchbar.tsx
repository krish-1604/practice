
"use client";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { debouncedValue: debouncedSearchTerm, triggerImmediately } = useDebounce(searchTerm, 1000);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    triggerImmediately();
  };

  return (
    <div className="py-4 px-4 bg-[#1B1B1B] text-[#39ff14] rounded-[30px] flex items-center">
      <input
        type="text"
        placeholder="Search user"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            triggerImmediately();
          }
        }}
        className="bg-transparent outline-none text-[#39ff14] placeholder-[#9D9D9D] w-full pr-2"
      />
      <div className="w-[1px] h-5 bg-[#7D7D7D] mr-3" />
      <button onClick={handleSearchClick}>
        <Search className="w-5 h-5 text-[#9D9D9D] mr-3" />
      </button>
    </div>
  );
}