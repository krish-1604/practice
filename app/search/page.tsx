"use client";
import SearchBar from "../components/searchbar";
import { useUserContext } from "../context/userContext";

export default function Search() {
  const { users } = useUserContext();

  return (
    <div>
      <div className="py-10 px-20">
        <SearchBar />
        <div className="mt-20 py-10 bg-[#1B1B1B] text-[#39ff14] rounded-[20px]">
          {users.length !== 0 ? (
            users.map((user, index) => (
              <div key={index} className="p-4 border-b border-gray-700">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-lg">{user.email}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-[#9D9D9D]">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
