"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserContextType {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: number, updatedUser: Omit<User, 'id'>) => void;
  removeUser: (id: number) => void;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from backend API on mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/proxy/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const addUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
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
  };

  return (
    <UserContext.Provider value={{ 
      users, 
      addUser, 
      updateUser, 
      removeUser, 
      loading, 
      error 
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