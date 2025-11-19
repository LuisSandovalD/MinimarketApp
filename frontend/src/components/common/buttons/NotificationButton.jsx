import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getNotification } from "@/api";
import { Link } from "react-router-dom";

export default function NotificationButton() {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

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

    const handleMarkAsRead = (id) => {
        setNotifications(prev => prev.filter(n => (n.id || n.key) !== id));
    };

    const getKey = (n, i) => n.id || i;

    return (
        <div className="relative">
            {/* Botón con tono rojo */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2.5 rounded-xl bg-white hover:bg-red-50 transition border border-red-200 shadow-sm"
            >
                <Bell size={20} className="text-red-600" />

                {notifications.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center border-2 border-white">
                        {notifications.length > 9 ? "9+" : notifications.length}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />

                    <div className="absolute right-0 mt-3 w-96 rounded-2xl shadow-xl bg-white border border-red-200 overflow-hidden z-50 animate-in fade-in duration-150">

                        {/* Header rojizo */}
                        <div className="px-5 py-3 bg-gradient-to-r from-red-600 to-red-400 text-white">
                            <h3 className="font-semibold text-lg">Alertas de Inventario</h3>
                            <p className="text-xs opacity-90">
                                {notifications.length} alertas pendientes
                            </p>
                        </div>

                        {/* Lista */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-10 text-center text-gray-500">
                                    No hay alertas pendientes
                                </div>
                            ) : (
                                <ul className="divide-y divide-red-100">
                                    {notifications.map((n, index) => {
                                        const key = getKey(n, index);

                                        // intensidad del rojo basado en prioridad
                                        const intensity = n.level === "high" 
                                            ? "bg-red-100 border-red-300"
                                            : n.level === "medium"
                                            ? "bg-red-50 border-red-200"
                                            : "bg-red-50";

                                        return (
                                            <li
                                                key={key}
                                                className={`px-5 py-4 border-l-4 ${intensity} hover:bg-red-100 transition`}
                                            >
                                                <Link
                                                    to={n.href || n.path || "#"}
                                                    onClick={() => {
                                                        handleMarkAsRead(key);
                                                        setShowDropdown(false);
                                                    }}
                                                >
                                                    <p className="font-semibold text-red-700 text-sm">
                                                        {n.message}
                                                    </p>
                                                    <p className="text-xs text-red-500 mt-1">
                                                        Hace unos momentos
                                                    </p>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="px-5 py-3 bg-red-50 border-t border-red-200">
                                <button
                                    onClick={() => setNotifications([])}
                                    className="w-full py-2 text-sm font-semibold text-red-700 hover:text-red-900 hover:bg-red-100 rounded-xl"
                                >
                                    Marcar todas como leídas
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
