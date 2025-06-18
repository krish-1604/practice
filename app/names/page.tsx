"use client";

import { useState, useEffect } from 'react';

interface User {
  name: string;
  uid: string;
}

export default function NamesPage() {
  const [userData, setUserData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseurl = "https://practice.mehtakrish.in";

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${baseurl}/dynamo`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle the nested response structure
      let users: User[] = [];
      if (data.success && data.lambdaResponse && data.lambdaResponse.body) {
        const bodyData = JSON.parse(data.lambdaResponse.body);
        if (bodyData.success && bodyData.items && Array.isArray(bodyData.items)) {
          users = bodyData.items;
        }
      }
      
      // Sort by name (you can change this to sort by uid if needed)
      const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
      setUserData(sortedUsers);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black text-[#39ff14] flex h-screen">
        <div className="flex-1 p-6">
          <h1 className="text-4xl font-bold">Names Data</h1>
          <div className="mt-20 py-10 bg-[#1B1B1B] text-[#39ff14] rounded-[20px]">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#39ff14]"></div>
              <p className="ml-3">Loading names data...</p>
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
          <h1 className="text-4xl font-bold">Names Data</h1>
          <div className="mt-20 py-10 bg-[#1B1B1B] text-red-500 rounded-[20px]">
            <p className="text-center">{error}</p>
            <button 
              onClick={fetchUserData}
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
          <h1 className="text-4xl font-bold">Names Data</h1>
          <div className="text-[#9D9D9D]">
            Total: {userData.length} records
          </div>
        </div>

        {userData.length > 0 ? (
          <div className="bg-[#1B1B1B] rounded-lg overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#2A2A2A] border-b border-[#3A3A3A]">
                    <th className="text-left py-4 px-6 text-[#39ff14] font-semibold">S.No</th>
                    <th className="text-left py-4 px-6 text-[#39ff14] font-semibold">UID</th>
                    <th className="text-left py-4 px-6 text-[#39ff14] font-semibold">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.map((item, index) => (
                    <tr 
                      key={item.uid}
                      className="border-b border-[#3A3A3A] hover:bg-[#2A2A2A] transition-colors"
                    >
                      <td className="py-4 px-6 text-[#9D9D9D]">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6 text-white font-mono text-sm">
                        {item.uid || '-'}
                      </td>
                      <td className="py-4 px-6 text-white">
                        {item.name || '-'}
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
              No Names found.
            </p>
            <button 
              onClick={fetchUserData}
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