"use client";
import { useState } from "react";
import { useFormValidation } from "../hooks/useFormValidation";
import { useUserOperations } from "../hooks/useUserOperations";
interface FormProps {
  onClose: () => void;
}

export default function Form({ onClose }: FormProps) {
  const { handleAddUser } = useUserOperations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    formData,
    errors,
    validateForm,
    handleInputChange,
    resetForm
  } = useFormValidation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
      if (validateForm()) {
        setIsSubmitting(true);
        try {
            await handleAddUser(formData);
            resetForm();
            onClose();
        } catch (error) {
            console.error("Error adding user:", error);
        } finally {
            setIsSubmitting(false);
        }
    }
  };

  const handleCancel = () => {
    resetForm();
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
        </button>        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 py-2 rounded-lg font-semibold transition-colors duration-200 ${
            isSubmitting 
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
              : 'bg-[#39ff14] text-black hover:bg-[#32cc12]'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}