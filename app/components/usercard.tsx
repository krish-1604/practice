import { forwardRef } from "react";
import { useState } from "react";
import { useFormValidation } from "../hooks/useFormValidation";
import { useUserOperations } from "../hooks/useUserOperations";

interface UserRowProps {
  id: number;
  displayNumber: number;
  name: string;
  email: string;
  isLast: boolean;
}

const UserRow = forwardRef<HTMLTableRowElement, UserRowProps>(
  ({ id, displayNumber, name, email, isLast }, ref) => {
    const [isEditing, setIsEditing] = useState(false);
    const { handleUpdateUser, handleDeleteUser, isUserDeleting } = useUserOperations();
    const {
      formData,
      errors,
      validateForm,
      handleInputChange,
      setInitialData
    } = useFormValidation({ name, email });

    const handleEdit = async () => {
      if (!validateForm()) return;

      try {
        await handleUpdateUser(id, formData);
        setIsEditing(false);
      } catch (error) {
        alert(`Error: ${error instanceof Error ? error.message : 'Failed to update user'}`);
      }
    };

    const handleDelete = async () => {
      try {
        await handleDeleteUser(id);
      } catch (error) {
        alert(`Error: ${error instanceof Error ? error.message : 'Failed to delete user'}`);
      }
    };

    const handleCancel = () => {
      setInitialData({ name, email });
      setIsEditing(false);
    };

    const handleEditClick = () => {
      setInitialData({ name, email });
      setIsEditing(true);
    };

    return (
      <tr 
        ref={ref}
        className={`hover:bg-[#2A2A2A] transition-colors ${
          !isLast ? 'border-b border-[#3A3A3A]' : ''
        }`}
      >
        <td className="py-4 px-6 text-[#9D9D9D] font-mono text-sm">{displayNumber}</td>
        
        {isEditing ? (
          <>
            <td className="py-4 px-6">
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
            </td>
            <td className="py-4 px-6">
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
            </td>
            <td className="py-4 px-6">
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="bg-[#39ff14] text-black py-2 px-4 rounded text-sm font-semibold hover:bg-[#32cc12] transition-colors duration-200"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-transparent border border-[#7D7D7D] text-[#9D9D9D] py-2 px-4 rounded text-sm font-semibold hover:bg-[#2A2A2A] transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </td>
          </>
        ) : (
          <>
            <td className="py-4 px-6 text-[#39ff14] font-medium">{name}</td>
            <td className="py-4 px-6 text-[#9D9D9D]">{email}</td>
            <td className="py-4 px-6">
              <div className="flex space-x-2">
                <button 
                  onClick={handleEditClick}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Edit
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isUserDeleting(id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUserDeleting(id) ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </td>
          </>
        )}
      </tr>
    );
  }
);

UserRow.displayName = "UserRow";

export default UserRow;