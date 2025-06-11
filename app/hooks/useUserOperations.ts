import { useState } from 'react';
import { useUserContext } from '../context/userContext';

interface User {
  id: number;
  name: string;
  email: string;
}

export function useUserOperations() {
  const { addUser, updateUser, removeUser } = useUserContext();
  const baseurl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isDeleting, setIsDeleting] = useState<Record<number, boolean>>({});
  const handleAddUser = async (userData: Omit<User, 'id'>) => {
    try {
      console.log('Sending user data:', userData);
        const response = await fetch(`${baseurl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        let errorMessage = 'Failed to add user';
        try {
          const errorData = await response.json();
          console.log('Error response data:', errorData);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          console.log('Could not parse error response:', parseError);
          const errorText = await response.text();
          console.log('Error response text:', errorText);
        }
        throw new Error(errorMessage);
      }      const newUser = await response.json();
      console.log('Successfully created user:', newUser);
      addUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const handleUpdateUser = async (id: number, userData: Omit<User, 'id'>) => {
    try {      const response = await fetch(`${baseurl}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      const updatedUser = await response.json();
      updateUser(id, userData);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return false;
    }

    setIsDeleting(prev => ({ ...prev, [id]: true }));
    try {      const response = await fetch(`${baseurl}/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      removeUser(id);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    } finally {
      setIsDeleting(prev => ({ ...prev, [id]: false }));
    }
  };

  const isUserDeleting = (id: number) => isDeleting[id] || false;

  return {
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
    isUserDeleting
  };
}
