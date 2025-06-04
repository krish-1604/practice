"use client";

import UserRow from "../components/usercard";
import { useUserContext } from "../context/userContext";
import { useEffect, useRef, useCallback } from "react";

export default function Dashboard() {
  const { 
    users, 
    error, 
    loading, 
    loadingMore, 
    hasMore, 
    loadMoreUsers, 
    totalUsers 
  } = useUserContext();
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  // Intersection Observer callback
  const lastUserElementRef = useCallback((node: HTMLTableRowElement | null) => {
    if (loading || loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreUsers();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, loadingMore, hasMore, loadMoreUsers]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-black text-[#39ff14] flex h-screen">
        <div className="flex-1 p-6">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="mt-20 py-10 bg-[#1B1B1B] text-[#39ff14] rounded-[20px]">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#39ff14]"></div>
              <p className="ml-3">Loading users...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && users.length === 0) {
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="text-[#9D9D9D]">
            Showing {users.length} of {totalUsers} users
          </div>
        </div>

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
                  {users.map((user, index) => {
                    const isLast = index === users.length - 1;
                    return (
                      <UserRow 
                        key={user.id} 
                        id={user.id}
                        name={user.name} 
                        email={user.email}
                        isLast={isLast}
                        ref={isLast ? lastUserElementRef : null}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Loading indicator for infinite scroll */}
            {loadingMore && (
              <div className="py-4 bg-[#1B1B1B] border-t border-[#3A3A3A]">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#39ff14]"></div>
                  <p className="ml-3 text-[#9D9D9D]">Loading more users...</p>
                </div>
              </div>
            )}
            
            {/* End of list indicator */}
            {!hasMore && users.length > 0 && (
              <div className="py-4 bg-[#1B1B1B] border-t border-[#3A3A3A]">
                <p className="text-center text-[#9D9D9D]">
                  All {totalUsers} users loaded
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-20 py-10 bg-[#1B1B1B] text-[#39ff14] rounded-[20px]">
            <p className="text-center text-[#9D9D9D]">No users found.</p>
          </div>
        )}
        
        {/* Error indicator for load more */}
        {error && users.length > 0 && (
          <div className="mt-4 py-3 px-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400 text-center">{error}</p>
            <button 
              onClick={loadMoreUsers}
              className="mt-2 mx-auto block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}