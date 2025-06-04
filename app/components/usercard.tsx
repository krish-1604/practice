import { forwardRef } from "react";

interface UserRowProps {
  id: number;
  name: string;
  email: string;
  isLast: boolean;
}

const UserRow = forwardRef<HTMLTableRowElement, UserRowProps>(
  ({ id, name, email, isLast }, ref) => {
    return (
      <tr 
        ref={ref}
        className={`hover:bg-[#2A2A2A] transition-colors ${
          !isLast ? 'border-b border-[#3A3A3A]' : ''
        }`}
      >
        <td className="py-4 px-6 text-[#39ff14]">{name}</td>
        <td className="py-4 px-6 text-[#9D9D9D]">{email}</td>
        <td className="py-4 px-6">
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
              Edit
            </button>
            <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors">
              Delete
            </button>
          </div>
        </td>
      </tr>
    );
  }
);

UserRow.displayName = "UserRow";

export default UserRow;