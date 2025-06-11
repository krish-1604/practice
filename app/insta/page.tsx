"use client";

import { useState, useEffect } from 'react';

interface IGUser {
  id: number;
  instagram_username: string;
  age: number;
}

export default function InstagramPage() {  const [igData, setIgData] = useState<IGUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseurl = process.env.NEXT_PUBLIC_BACKEND_URL;
  useEffect(() => {
    fetchIgData();
  }, []);

  const fetchIgData = async () => {    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${baseurl}/ig`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle different possible response structures
      let users: IGUser[] = [];
      if (Array.isArray(data)) {
        users = data;
      } else if (data.users && Array.isArray(data.users)) {
        users = data.users;
      } else if (data.data && Array.isArray(data.data)) {
        users = data.data;
      }
      
      // Sort by ID ascending (ID 1 first) and set the data
      const sortedUsers = users.sort((a, b) => a.id - b.id);
      setIgData(sortedUsers);
    } catch (err) {
      console.error('Error fetching IG data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black text-[#39ff14] flex h-screen">
        <div className="flex-1 p-6">
          <h1 className="text-4xl font-bold">Instagram Data</h1>
          <div className="mt-20 py-10 bg-[#1B1B1B] text-[#39ff14] rounded-[20px]">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#39ff14]"></div>
              <p className="ml-3">Loading Instagram data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-[#39ff14] flex h-screen">
        <div className="flex-1 p-6">
          <h1 className="text-4xl font-bold">Instagram Data</h1>
          <div className="mt-20 py-10 bg-[#1B1B1B] text-red-500 rounded-[20px]">
            <p className="text-center">{error}</p>
            <button 
              onClick={fetchIgData}
              className="mt-4 mx-auto block px-4 py-2 bg-[#39ff14] hover:bg-[#2dd10f] text-black rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-[#39ff14] min-h-screen">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Instagram Data</h1>
          <div className="text-[#9D9D9D]">
            Total: {igData.length} records
          </div>
        </div>

        {igData.length > 0 ? (
          <div className="bg-[#1B1B1B] rounded-lg overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#2A2A2A] border-b border-[#3A3A3A]">
                    <th className="text-left py-4 px-6 text-[#39ff14] font-semibold">Number</th>
                    <th className="text-left py-4 px-6 text-[#39ff14] font-semibold">Instagram Username</th>
                    <th className="text-left py-4 px-6 text-[#39ff14] font-semibold">Age</th>
                  </tr>
                </thead>
                <tbody>
                  {igData.map((item, index) => (
                    <tr 
                      key={item.id}
                      className="border-b border-[#3A3A3A] hover:bg-[#2A2A2A] transition-colors"
                    >
                      <td className="py-4 px-6 text-[#9D9D9D]">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6 text-white">
                        {item.instagram_username || '-'}
                      </td>
                      <td className="py-4 px-6 text-white">
                        {item.age || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-20 py-10 bg-[#1B1B1B] text-[#39ff14] rounded-[20px]">
            <p className="text-center text-[#9D9D9D]">
              No Instagram data found.
            </p>
            <button 
              onClick={fetchIgData}
              className="mt-4 mx-auto block px-4 py-2 bg-[#39ff14] hover:bg-[#2dd10f] text-black rounded transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}