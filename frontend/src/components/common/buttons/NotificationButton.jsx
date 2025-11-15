// src/components/common/NotificationButton.jsx
import { useEffect, useState } from "react";
import { Bell, X, Check, CheckCircle } from "lucide-react";
// CORRECCIÓN: Eliminamos la importación de markNotificationAsRead
import { getNotification } from "@/api"; 
import { Link } from "react-router-dom"; 

export default function NotificationButton() {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loadingRead, setLoadingRead] = useState(false); 

    // Función para cargar notificaciones (Esta sí necesita la API)
    const fetchNotifications = async () => {
        try {
            const res = await getNotification();
            const data = res?.data || res;
            setNotifications(data.notifications || data || []); 
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = (notificationId) => {
        // Actualizar el estado local para eliminar la notificación inmediatamente
        setNotifications(prev => prev.filter(n => (n.id || n.key) !== notificationId));
    };

    const handleMarkAllRead = () => {
        if (notifications.length === 0) return;
        
        // Simplemente vaciamos el estado local inmediatamente
        setNotifications([]);
        setShowDropdown(false);
    };

    // Usaremos un ID de notificación, asumiendo que la API lo proporciona (n.id)
    const getNotificationKey = (n, index) => n.id || index;

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2.5 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow border border-gray-200 group"
            >
                <Bell size={20} className="text-gray-700 group-hover:text-gray-900 transition-colors" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1.5 shadow-lg border-2 border-white animate-pulse">
                        {notifications.length > 9 ? "9+" : notifications.length}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowDropdown(false)}
                    />
                    
                    <div className="absolute right-0 mt-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
                        
                        {/* Header con degradado sutil */}
                        <div className="px-5 py-4 bg-gradient-to-br from-gray-50 via-white to-gray-50 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                                        <Bell size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-base">
                                            Notificaciones
                                        </h3>
                                        {notifications.length > 0 && (
                                            <p className="text-xs text-gray-500">
                                                Tienes **{notifications.length}** {notifications.length === 1 ? 'nueva' : 'nuevas'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {/* Botón Marcar todas como leídas (solo limpia el estado local) */}
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            className="px-2 py-1.5 text-xs text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center gap-1"
                                        >
                                            Marcar todas
                                            <CheckCircle size={14} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowDropdown(false)}
                                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
                                    >
                                        <X size={18} className="text-gray-500 group-hover:text-gray-700" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        {notifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
                                    <Bell size={32} className="text-gray-400" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1">
                                    Todo está al día
                                </h4>
                                <p className="text-gray-500 text-sm">
                                    No tienes notificaciones pendientes
                                </p>
                            </div>
                        ) : (
                            <div className="max-h-[420px] overflow-y-auto">
                                <ul className="divide-y divide-gray-100">
                                    {notifications.map((n, index) => (
                                        <li
                                            key={getNotificationKey(n, index)} 
                                            className="px-5 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 group relative"
                                        >
                                            <Link 
                                                to={n.href || n.path || '#'}
                                                onClick={() => {
                                                    handleMarkAsRead(getNotificationKey(n, index)); // Solo limpia localmente
                                                    setShowDropdown(false); 
                                                }}
                                                className="flex items-start gap-3.5"
                                            >
                                                <div className="relative flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                                        <Bell size={18} className="text-white" />
                                                    </div>
                                                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
                                                </div>
                                                <div className="flex-1 min-w-0 pt-0.5">
                                                    <p className="text-sm text-gray-800 leading-relaxed font-medium">
                                                        {n.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Hace unos momentos
                                                    </p>
                                                </div>
                                            </Link>
                                            {/* Botón de marcar como leído individual (solo limpia el estado local) */}
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleMarkAsRead(getNotificationKey(n, index))}
                                                    className="p-1.5 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50"
                                                >
                                                    <Check size={14} className="text-gray-600" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {notifications.length > 0 && (
                            <div className="px-5 py-3.5 bg-gradient-to-br from-gray-50 via-white to-gray-50 border-t border-gray-100">
                                <Link
                                    to="/shopping-list" 
                                    onClick={() => setShowDropdown(false)}
                                    className="w-full py-2.5 px-4 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                                >
                                    <Check size={16} className="group-hover:scale-110 transition-transform" />
                                    Ver todas las notificaciones
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}