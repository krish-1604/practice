"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiResponse {
  users: User[];
  hasMore: boolean;
  totalUsers: number;
  nextStart: number;
  currentStart: number;
  limit: number;
}

interface UserContextType {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: number, updatedUser: Omit<User, 'id'>) => void;
  removeUser: (id: number) => void;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMoreUsers: () => void;
  totalUsers: number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextStart, setNextStart] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch initial users on mount
  useEffect(() => {
    async function fetchInitialUsers() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/proxy/users?start=0&limit=10`);
        if (!response.ok) throw new Error("Failed to fetch users");
        const data: ApiResponse = await response.json();
        
        setUsers(data.users);
        setHasMore(data.hasMore);
        setNextStart(data.nextStart);
        setTotalUsers(data.totalUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    fetchInitialUsers();
  }, []);

  const loadMoreUsers = useCallback(async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      setError(null);
      const response = await fetch(`/api/proxy/users?start=${nextStart}&limit=10`);
      if (!response.ok) throw new Error("Failed to fetch more users");
      const data: ApiResponse = await response.json();
      
      setUsers(prev => [...prev, ...data.users]);
      setHasMore(data.hasMore);
      setNextStart(data.nextStart);
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.error("Error fetching more users:", error);
      setError("Failed to load more users");
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, nextStart]);

  const addUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
    setTotalUsers(prev => prev + 1);
  };

  const updateUser = (id: number, updatedUser: Omit<User, 'id'>) => {
    setUsers((prev) => 
      prev.map((user) => 
        user.id === id ? { ...user, ...updatedUser } : user
      )
    );
  };

  const removeUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    setTotalUsers(prev => prev - 1);
  };

  return (
    <UserContext.Provider value={{ 
      users, 
      addUser, 
      updateUser, 
      removeUser, 
      loading, 
      loadingMore,
      error,
      hasMore,
      loadMoreUsers,
      totalUsers
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}