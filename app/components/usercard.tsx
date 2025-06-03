"use client";

import { useState } from "react";
import { useUserContext } from "../context/userContext";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Card({ id, name, email }: User) {
  const { updateUser, removeUser } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({ name, email });
  const [errors, setErrors] = useState({ name: "", email: "" });

  const validateForm = () => {
    const newErrors = { name: "", email: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleEdit = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(`http://localhost:8000/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to update user'}`);
        return;
      }

      updateUser(id, formData);
      setIsEditing(false);
      setErrors({ name: "", email: "" });
    } catch (error) {
      alert('Network error: Could not connect to the server');
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:8000/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to delete user'}`);
        return;
      }

      removeUser(id);
    } catch (error) {
      alert('Network error: Could not connect to the server');
      console.error('Error deleting user:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name, email });
    setErrors({ name: "", email: "" });
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="bg-[#1B1B1B] p-4 rounded-lg shadow-md text-white">
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter name"
              className={`w-full p-2 bg-transparent border rounded-lg text-[#39ff14] placeholder-[#9D9D9D] outline-none transition-colors text-sm ${
                errors.name
                  ? "border-red-500"
                  : "border-[#7D7D7D] focus:border-[#39ff14]"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          
          <div>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email"
              className={`w-full p-2 bg-transparent border rounded-lg text-[#39ff14] placeholder-[#9D9D9D] outline-none transition-colors text-sm ${
                errors.email
                  ? "border-red-500"
                  : "border-[#7D7D7D] focus:border-[#39ff14]"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex-1 bg-[#39ff14] text-black py-1 px-3 rounded text-sm font-semibold hover:bg-[#32cc12] transition-colors duration-200"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-transparent border border-[#7D7D7D] text-[#9D9D9D] py-1 px-3 rounded text-sm font-semibold hover:bg-[#2A2A2A] transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-[#39ff14] mb-1">{name}</h2>
          <p className="text-gray-400 mb-3">{email}</p>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-blue-600 text-white py-1 px-3 rounded text-sm font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-600 text-white py-1 px-3 rounded text-sm font-semibold hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}