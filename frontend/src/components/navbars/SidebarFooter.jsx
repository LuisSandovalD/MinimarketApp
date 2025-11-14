import { LogOut } from "lucide-react";

export default function SidebarFooter({ handleLogout }) {
  return (
    <div className="p-5 border-t border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-inner space-y-3">
      {/* Botón de cerrar sesión */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl 
        bg-gradient-to-r from-red-50 to-red-100 
        text-red-600 border border-red-200
        hover:from-red-100 hover:to-red-200
        transition-all duration-300 font-medium text-sm"
      >
        <LogOut size={18} />
        <span>Salir del sistema</span>
      </button>

      {/* Información de pie de sidebar */}
      <div className="rounded-lg p-3 text-center bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
        <p className="text-xs font-semibold text-gray-600 tracking-wide">
          Minimarket Don Lucho
        </p>
        <p className="text-[11px] text-gray-500 mt-1">
          © 2025 Luis Sandoval
        </p>
      </div>
    </div>
  );
}
