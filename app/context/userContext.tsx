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
  addUserAPI: (user: Omit<User, 'id'>) => Promise<void>;
  updateUserAPI: (id: number, updatedUser: Omit<User, 'id'>) => Promise<void>;
  removeUserAPI: (id: number) => Promise<void>;
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
  const [nextStart, setNextStart] = useState(0);  const [totalUsers, setTotalUsers] = useState(0);
  const baseurl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  const mergeUsers = (existingUsers: User[], newUsers: User[]): User[] => {
    return [...existingUsers, ...newUsers];
  };

  useEffect(() => {
    async function fetchInitialUsers() {
      try {        setLoading(true);
        setError(null);
        const response = await fetch(`${baseurl}/users?start=0&limit=10`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: ApiResponse = await response.json();
        
        setUsers(data.users || []);
        setHasMore(data.hasMore || false);
        setNextStart(data.nextStart || 10);
        setTotalUsers(data.totalUsers || 0);
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

    try {      setLoadingMore(true);
      setError(null);
      const response = await fetch(`${baseurl}/users?start=${nextStart}&limit=10`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: ApiResponse = await response.json();
      
      setUsers(prev => mergeUsers(prev, data.users || []));
      setHasMore(data.hasMore || false);
      setNextStart(data.nextStart || nextStart + 10);
      setTotalUsers(data.totalUsers || 0);
    } catch (error) {
      console.error("Error fetching more users:", error);
      setError("Failed to load more users");
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, nextStart]);
  const addUser = (user: User) => {
    setUsers((prev) => {
      if (prev.some(existingUser => existingUser.id === user.id)) {
        return prev;
      }
      return [...prev, user].sort((a, b) => a.id - b.id);
    });
    setTotalUsers(prev => prev + 1);
  };
  const addUserAPI = async (user: Omit<User, 'id'>) => {
    try {
      const response = await fetch(`${baseurl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const newUser: User = await response.json();
      
      addUser(newUser);
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to add user");
    }
  };
  const updateUser = (id: number, updatedUser: Omit<User, 'id'>) => {
    setUsers((prev) => 
      prev.map((user) => 
        user.id === id ? { ...updatedUser, id } : user
      )
    );
  };  const updateUserAPI = async (id: number, updatedUser: Omit<User, 'id'>) => {
    try {
      const response = await fetch(`${baseurl}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      updateUser(id, updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user");
    }
  };
  const removeUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    setTotalUsers(prev => Math.max(0, prev - 1));
  };
  const removeUserAPI = async (id: number) => {
    try {
      const response = await fetch(`${baseurl}/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      removeUser(id);
    } catch (error) {
      console.error("Error removing user:", error);
      setError("Failed to remove user");
    }
  };
  return (
    <UserContext.Provider value={{ 
      users, 
      addUser, 
      updateUser, 
      removeUser,
      addUserAPI,
      updateUserAPI,
      removeUserAPI,
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