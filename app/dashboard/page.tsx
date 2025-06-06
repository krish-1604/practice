"use client";

import SearchBar from "../components/searchbar";
import UserRow from "../components/usercard";
import { useUserContext } from "../context/userContext";
import { useState, useCallback } from "react";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

interface User {
  id: number;
  name: string;
  email: string;
}

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
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);
      
      const response = await fetch(`/api/proxy/users/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSearchResults(data.users || data || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Failed to search users');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const lastUserElementRef = useInfiniteScroll({
    hasMore,
    isLoading: loading || loadingMore,
    onLoadMore: loadMoreUsers,
    threshold: 0.1,
    rootMargin: '100px',
    enabled: !searchQuery.trim()
  });

  const displayUsers = searchQuery.trim() ? searchResults : users;
  const isInSearchMode = searchQuery.trim() !== "";

  if (loading && !isInSearchMode) {
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

  if (error && users.length === 0 && !isInSearchMode) {
    return (
      <div className="bg-black text-[#39ff14] flex h-screen">
        <div className="flex-1 p-6">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="mt-20 py-10 bg-[#1B1B1B] text-red-500 rounded-[20px]">
            <p className="text-center">{error}</p>
            <button 
              onClick={() => window.location.reload()}
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
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="text-[#9D9D9D]">
            {isInSearchMode ? (
              <>
                Found {displayUsers.length} user{displayUsers.length !== 1 ? 's' : ''}
                {isSearching && (
                  <span className="ml-2">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-[#39ff14]"></div>
                  </span>
                )}
              </>
            ) : (
              `Showing ${users.length} of ${totalUsers} users`
            )}
          </div>
        </div>
        
        <div className="py-10 px-20">
          <SearchBar onSearch={handleSearch} />     
        </div>

        {/* Search status indicator */}
        {isInSearchMode && (
          <div className="mb-4 px-4">
            <p className="text-[#9D9D9D] text-sm">
              {isSearching ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-3 w-3 border-b border-[#39ff14] mr-2"></span>
                  Searching for: &quot;<span className="text-[#39ff14]">{searchQuery}</span>&quot;
                </>
              ) : (
                <>
                  Search results for: &quot;<span className="text-[#39ff14]">{searchQuery}</span>&quot;
                  {displayUsers.length === 0 && " - No matches found"}
                </>
              )}
            </p>
          </div>
        )}

        {/* Search error */}
        {searchError && (
          <div className="mb-4 py-3 px-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400 text-center">{searchError}</p>
            <button 
              onClick={() => handleSearch(searchQuery)}
              className="mt-2 mx-auto block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {displayUsers.length > 0 ? (
          <div className="bg-[#1B1B1B] rounded-lg overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#2A2A2A] border-b border-[#3A3A3A]">
                    <th className="text-left py-4 px-6 text-[#39ff14] font-semibold">ID</th>
                    <th className="text-left py-4 px-6 text-[#39ff14] font-semibold">Name</th>
                    <th className="text-left py-4 px-6 text-[#39ff14] font-semibold">Email</th>
                    <th className="text-left py-4 px-6 text-[#39ff14] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayUsers.map((user, index) => {
                    const isLast = index === displayUsers.length - 1;
                    const displayNumber = index + 1;
                    return (
                      <UserRow 
                        key={`user-${user.id}-${index}-${isInSearchMode ? 'search' : 'normal'}`}
                        id={user.id}
                        displayNumber={displayNumber}
                        name={user.name} 
                        email={user.email}
                        isLast={isLast}
                        ref={isLast && !isInSearchMode ? lastUserElementRef : null}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {loadingMore && !isInSearchMode && (
              <div className="py-4 bg-[#1B1B1B] border-t border-[#3A3A3A]">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#39ff14]"></div>
                  <p className="ml-3 text-[#9D9D9D]">Loading more users...</p>
                </div>
              </div>
            )}
            
            {!hasMore && displayUsers.length > 0 && !isInSearchMode && (
              <div className="py-4 bg-[#1B1B1B] border-t border-[#3A3A3A]">
                <p className="text-center text-[#9D9D9D]">
                  All {totalUsers} users loaded
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-20 py-10 bg-[#1B1B1B] text-[#39ff14] rounded-[20px]">
            <p className="text-center text-[#9D9D9D]">
              {isInSearchMode ? (
                isSearching ? "Searching..." : "No users match your search."
              ) : (
                "No users found."
              )}
            </p>
            {!loading && !isInSearchMode && (
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 mx-auto block px-4 py-2 bg-[#39ff14] hover:bg-[#2dd10f] text-black rounded transition-colors"
              >
                Refresh
              </button>
            )}
          </div>
        )}
        
        {error && users.length > 0 && !isInSearchMode && (
          <div className="mt-4 py-3 px-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400 text-center">{error}</p>
            <button 
              onClick={loadMoreUsers}
              disabled={loadingMore}
              className="mt-2 mx-auto block px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              {loadingMore ? 'Loading...' : 'Try Again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}