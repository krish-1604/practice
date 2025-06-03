"use client";

import Card from "../components/usercard";
import { useUserContext } from "../context/userContext";

export default function Dashboard() {
  const { users, loading, error } = useUserContext();

  if (error) {
    return (
      <div className="bg-black text-[#39ff14] flex h-screen">
        <div className="flex-1 p-6">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="mt-20 py-10 bg-[#1B1B1B] text-red-500 rounded-[20px]">
            <p className="text-center">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-[#39ff14] flex h-screen">
      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold">Dashboard</h1>

        {users.length !== 0 ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card 
                key={user.id} 
                id={user.id}
                name={user.name} 
                email={user.email} 
              />
            ))}
          </div>
        ) : (
          <div className="mt-20 py-10 bg-[#1B1B1B] text-[#39ff14] rounded-[20px]">
            <p className="text-center text-[#9D9D9D]">No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
}