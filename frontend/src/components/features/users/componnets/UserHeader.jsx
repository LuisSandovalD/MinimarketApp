import { UserPlus } from "lucide-react";
import UserExportMenu from "./UserExportMenu";

export default function UserHeader({ onNewUser, users }) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Gestión de Usuarios
        </h1>
        <p className="text-gray-600">Administra los usuarios del sistema</p>
      </div>

      <div className="flex gap-3">
        <UserExportMenu users={users} />

        <button
          onClick={onNewUser}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
        >
          <UserPlus size={20} />
          Nuevo Usuario
        </button>
      </div>
    </div>
  );
}