import { motion } from "framer-motion";
import { Mail, Shield, Tag, Calendar, Edit, Trash2 } from "lucide-react";

export default function UserTable({ users, indexOfFirst, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                N°
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                Usuario
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                Rol
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                Permisos
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                Fecha Registro
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              const roleName = user.roles?.[0]?.name || "Sin rol";
              const permissions = user.roles?.[0]?.permissions?.map((p) => p.name) || [];
              const globalIndex = indexOfFirst + index + 1;

              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-gray-600 font-medium">{globalIndex}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center border border-blue-200">
                        <span className="text-blue-600 font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Mail size={12} />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
                      <Shield size={12} />
                      {roleName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {permissions.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {permissions.slice(0, 3).map((perm, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded-md border border-gray-200"
                          >
                            <Tag size={10} />
                            {perm}
                          </span>
                        ))}
                        {permissions.length > 3 && (
                          <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded-md font-medium">
                            +{permissions.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-xs">
                        Sin permisos
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Calendar size={12} />
                      {new Date(user.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        className="p-2 hover:bg-red-50 border border-red-200 text-red-600 rounded-lg transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}