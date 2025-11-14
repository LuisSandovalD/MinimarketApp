import { X } from "lucide-react";

export default function ErrorState({ onRetry }) {
  return (
    <div className="flex items-center justify-center h-full p-6 bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="text-center rounded-xl p-6 border border-gray-200 shadow-sm bg-white">
        {/* Ícono de error */}
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
          <X className="text-red-500" size={32} />
        </div>

        {/* Mensaje */}
        <p className="text-sm text-gray-700 font-medium mb-3">
          Ocurrió un error al cargar la información del usuario.
        </p>

        {/* Botón de recargar */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Recargar página
          </button>
        )}
      </div>
    </div>
  );
}
