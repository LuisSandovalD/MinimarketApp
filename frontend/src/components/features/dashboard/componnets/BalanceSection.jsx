// src/components/dashboard/BalanceSection.jsx

import { FileText } from 'lucide-react';
import RestrictedSection from './RestrictedSection'; // Asegúrate de tener la ruta correcta

export default function BalanceSection({ data, isAdmin, formatCurrency }) {
    if (!data?.balance) return null;

    const { ventas, compras, utilidad } = data.balance;

    const cards = [
        {
            title: 'Ingresos (Ventas)',
            value: formatCurrency(ventas),
            description: 'Total de ingresos registrados',
            color: 'green',
            border: 'border-green-200',
            bgIcon: 'bg-green-500',
            textMain: 'text-green-800',
            textSub: 'text-green-700',
        },
        {
            title: 'Egresos (Compras)',
            value: formatCurrency(compras),
            description: 'Total de egresos registrados',
            color: 'red',
            border: 'border-red-200',
            bgIcon: 'bg-red-500',
            textMain: 'text-red-800',
            textSub: 'text-red-700',
        },
        {
            title: 'Utilidad Neta',
            value: formatCurrency(utilidad),
            description: 'Resultado final del período',
            color: utilidad >= 0 ? 'blue' : 'red',
            border: utilidad >= 0 ? 'border-blue-200' : 'border-red-200',
            bgIcon: utilidad >= 0 ? 'bg-blue-500' : 'bg-red-500',
            textMain: utilidad >= 0 ? 'text-blue-800' : 'text-red-800',
            textSub: utilidad >= 0 ? 'text-blue-700' : 'text-red-700',
        },
    ];

    return (
        <RestrictedSection isAdmin={isAdmin}>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    Balance General del Período
                    <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        Solo Admin
                    </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-xl p-6 border ${card.border} shadow-sm hover:shadow-md transition-all`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`${card.textSub} text-sm font-medium mb-1`}>
                                        {card.title}
                                    </p>
                                    <p className={`text-3xl font-bold ${card.textMain}`}>
                                        {card.value}
                                    </p>
                                    <p className={`text-xs ${card.textSub} mt-1`}>
                                        {card.description}
                                    </p>
                                </div>
                                <div className={`${card.bgIcon} p-4 rounded-xl shadow-md`}>
                                    <FileText className="text-white" size={28} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </RestrictedSection>
    );
}
