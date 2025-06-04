"use client";

import UserRow from "../components/usercard";
import { useUserContext } from "../context/userContext";

export default function Dashboard() {
  const { users, error } = useUserContext();

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
    <div className="bg-black text-[#39ff14] min-h-screen">
      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {users.length !== 0 ? (
          <div className="bg-[#1B1B1B] rounded-lg overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#2A2A2A] border-b border-[#3A3A3A]">
                    <th className="text-left py-4 px-6 text-[#39ff14] font-semibold">Name</th>
                    <th className="text-left py-4 px-6 text-[#39ff14] font-semibold">Email</th>
                    <th className="text-left py-4 px-6 text-[#39ff14] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <UserRow 
                      key={user.id} 
                      id={user.id}
                      name={user.name} 
                      email={user.email}
                      isLast={index === users.length - 1}
                    />
                  ))}
                </tbody>
              </table>
            </div>
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