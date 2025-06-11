import { useState, useCallback } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const baseurl = process.env.NEXT_PUBLIC_BACKEND_URL;
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
    }    try {
      setIsSearching(true);
      setSearchError(null);
      
      const url = `${baseurl}/users/search?query=${encodeURIComponent(query)}`;
      console.log('Search URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search failed:', response.status, errorText);
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

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setSearchError(null);
  };

  return {
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    handleSearch,
    clearSearch,
    isInSearchMode: searchQuery.trim() !== ''
  };
}