"use client";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Call onSearch when debounced term changes
  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    setDebouncedSearchTerm(searchTerm);
  };

  return (
    <div className="py-4 px-4 bg-[#1B1B1B] text-[#39ff14] rounded-[30px] flex items-center">
      <input
        type="text"
        placeholder="Search user"
        value={searchTerm}
        onChange={handleInputChange}
        className="bg-transparent outline-none text-[#39ff14] placeholder-[#9D9D9D] w-full pr-2"
      />
      <div className="w-[1px] h-5 bg-[#7D7D7D] mr-3" />
      <button onClick={handleSearchClick}>
        <Search className="w-5 h-5 text-[#9D9D9D] mr-3" />
      </button>
    </div>
  );
}