"use client";
import { useState } from "react";
import { useUserContext } from "../context/userContext";

interface FormProps {
  onClose: () => void;
}

export default function Form({ onClose }: FormProps) {
  const { addUser } = useUserContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (validateForm()) {
    try {
      const response = await fetch('/api/proxy/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to add user'}`);
        return;
      }

      const newUser = await response.json();
      addUser(newUser);  // Add user to context state
      
      setFormData({ name: '', email: '' });
      setErrors({ name: '', email: '' });
      onClose();
    } catch (error) {
      alert('Network error: Could not connect to the server');
      console.error('Error adding user:', error);
    }
  }
};


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", email: "" });
    setErrors({ name: "", email: "" });
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1A1A1A] p-6 rounded-xl shadow-xl w-full max-w-md"
    >
      <h2 className="text-2xl font-bold text-[#39ff14] mb-6">Create Form</h2>

      <div className="mb-4">
        <label htmlFor="name" className="block text-[#9D9D9D] mb-2">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your name"
          className={`w-full p-2 bg-transparent border rounded-lg text-[#39ff14] placeholder-[#9D9D9D] outline-none transition-colors ${
            errors.name
              ? "border-red-500"
              : "border-[#7D7D7D] focus:border-[#39ff14]"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="email" className="block text-[#9D9D9D] mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          className={`w-full p-2 bg-transparent border rounded-lg text-[#39ff14] placeholder-[#9D9D9D] outline-none transition-colors ${
            errors.email
              ? "border-red-500"
              : "border-[#7D7D7D] focus:border-[#39ff14]"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 bg-transparent border border-[#7D7D7D] text-[#9D9D9D] py-2 rounded-lg font-semibold hover:bg-[#2A2A2A] transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 bg-[#39ff14] text-black py-2 rounded-lg font-semibold hover:bg-[#32cc12] transition-colors duration-200"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
