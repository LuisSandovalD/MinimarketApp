import { useState, useEffect } from "react";
import { getUser } from "@/api";
import {
  User,
  X,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function AdminInfoPanel() {
  const [admin, setAdmin] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const data = await getUser();
        setAdmin(data);
      } catch (error) {
        console.error("Error al obtener la información del administrador:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAdmin();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const days = [
      "Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"
    ];
    const months = [
      "Enero","Febrero","Marzo","Abril","Mayo","Junio",
      "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
    ];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  return (
    <div className="">
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-200 shadow p-3 rounded-full hover:bg-gray-300 transition-all"
        aria-label="Abrir perfil de administrador"
      >
        <User className="w-5 h-5" />
      </button>

      {/* Fondo desenfocado */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        />
      )}

      {/* Panel lateral */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white border-l border-gray-200 
        shadow-xl transform transition-transform duration-300 ease-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Encabezado */}
        <div className="p-6 border-b border-gray-200 relative bg-gray-50">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 hover:bg-gray-100 rounded-lg p-2 transition-all"
            aria-label="Cerrar panel"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">Administrador</h2>
          <p className="text-sm text-gray-500">Panel de información personal</p>
        </div>

        {/* Contenido */}
        <div className="p-5 overflow-y-auto h-[calc(100%-120px)] bg-gray-50/70">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-400" />
            </div>
          ) : admin ? (
            <div className="space-y-6">

              {/* Avatar y nombre */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300 shadow-inner">
                    <User className="w-14 h-14 text-gray-600" />
                  </div>
                  {admin.is_active && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mt-4">
                  {admin.name}
                </h3>
                <p className="text-sm text-blue-500 font-medium flex items-center gap-1 mt-1">
                  <Mail className="w-4 h-4" /> {admin.email}
                </p>
                <p className="text-xs text-gray-500 mt-1">Administrador del sistema</p>
              </div>

              {/* Sección de fecha y hora */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> Fecha y Hora Actual
                  </span>
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-700">{formatDate(currentTime)}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {formatTime(currentTime)}
                  </p>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 space-y-3">
                <h4 className="text-sm font-semibold text-gray-600 mb-1">
                  Información de contacto
                </h4>
                <InfoRow
                  icon={<Phone className="w-5 h-5 text-gray-500" />}
                  label="Teléfono"
                  value={admin.phone || "No registrado"}
                />
              </div>

              {/* Estado */}
              <div
                className={`rounded-xl p-5 border shadow-sm text-center ${
                  admin.is_active
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                {admin.is_active ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-green-700">Cuenta activa</p>
                    <p className="text-xs text-gray-500 mt-1">
                      El administrador se encuentra disponible
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="font-semibold text-red-700">Cuenta inactiva</p>
                    <p className="text-xs text-gray-500 mt-1">
                      No disponible actualmente
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <XCircle className="w-14 h-14 text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">No se pudo cargar la información</p>
              <p className="text-gray-400 text-sm mt-1">
                Intenta nuevamente más tarde
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* --- Componente reutilizable para filas de datos --- */
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
      {icon}
      <div>
        <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}
