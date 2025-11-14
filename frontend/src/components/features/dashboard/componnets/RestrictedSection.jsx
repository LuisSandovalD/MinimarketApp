// src/components/dashboard/RestrictedSection.jsx

import { Lock } from 'lucide-react';

export default function RestrictedSection({ children, isAdmin }) {
    if (!isAdmin) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-8 mb-6 border-2 border-gray-300">
                <div className="flex flex-col items-center justify-center gap-4 text-gray-600">
                    <div className="bg-white p-4 rounded-full shadow-md">
                        <Lock className="w-8 h-8 text-gray-500" />
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-gray-700 mb-1">Sección Restringida</p>
                        <p className="text-sm text-gray-500">Esta información solo está disponible para administradores</p>
                    </div>
                </div>
            </div>
        );
    }
    return children;
}