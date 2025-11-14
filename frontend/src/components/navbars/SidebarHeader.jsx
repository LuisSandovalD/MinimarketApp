import { LayoutDashboard } from "lucide-react";

export default function SidebarHeader({ user }) {
  return (
    <div className="relative p-6 border-b border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-sm">
      {/* Contenedor principal */}
      <div className="flex items-center gap-4">
        {/* Ícono del sistema */}
        <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-400/30">
          <LayoutDashboard size={22} className="text-white" />
        </div>

        {/* Información del sistema y usuario */}
        <div className="flex flex-col">
          <h1 className="text-base font-semibold text-gray-800 tracking-tight">
            Minimarket "Don Lucho"
          </h1>
          <p className="text-xs text-gray-500 capitalize mt-0.5">
            {user?.name || "Cargando usuario..."}
          </p>
        </div>
      </div>
    </div>
  );
}
