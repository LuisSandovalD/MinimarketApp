// src/components/dashboard/CreditsSection.jsx

import { CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function CreditsSection({ data }) {
    if (!data?.credits) return null;

    const creditStats = [
        { title: "Total Créditos", value: data.credits.total, color: "blue", description: "Créditos registrados", icon: CreditCard },
        { title: "Activos", value: data.credits.activos, color: "yellow", description: "En curso o pendientes", icon: Clock },
        { title: "Pagados", value: data.credits.pagados, color: "green", description: "Créditos completados", icon: CheckCircle },
        { title: "Vencidos", value: data.credits.status, color: "red", description: "Créditos vencidos", icon: XCircle },
    ];

    const getColorClasses = (color) => {
        switch (color) {
            case 'yellow':
                return { border: "border-yellow-200", bg: "bg-yellow-50", textMain: "text-yellow-800", textSub: "text-yellow-700", iconBg: "bg-yellow-500" };
            case 'green':
                return { border: "border-green-200", bg: "bg-green-50", textMain: "text-green-800", textSub: "text-green-700", iconBg: "bg-green-500" };
            case 'red':
                return { border: "border-red-200", bg: "bg-red-50", textMain: "text-red-800", textSub: "text-red-700", iconBg: "bg-red-500" };
            case 'blue': default:
                return { border: "border-blue-200", bg: "bg-blue-50", textMain: "text-blue-800", textSub: "text-blue-700", iconBg: "bg-blue-500" };
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-indigo-600" />
                Gestión de Créditos
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {creditStats.map((stat, index) => {
                    const classes = getColorClasses(stat.color);
                    const Icon = stat.icon;

                    return (
                        <div
                            key={index}
                            className={`bg-white rounded-xl p-6 border ${classes.border} shadow-sm hover:shadow-md transition-all`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`${classes.textSub} text-sm font-medium mb-1`}>
                                        {stat.title}
                                    </p>
                                    <p className={`text-3xl font-bold ${classes.textMain}`}>
                                        {stat.value}
                                    </p>
                                    <p className={`text-xs ${classes.textSub} mt-1`}>
                                        {stat.description}
                                    </p>
                                </div>
                                <div className={`${classes.iconBg} p-4 rounded-xl shadow-md`}>
                                    <Icon className="text-white" size={28} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
