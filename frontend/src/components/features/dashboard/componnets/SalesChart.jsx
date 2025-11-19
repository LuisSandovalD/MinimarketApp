// src/components/dashboard/SalesChart.jsx

import { TrendingUp } from 'lucide-react';

export default function SalesChart({ data, maxSale, formatCurrency, formatDate }) {
    if (!data?.charts?.salesByDay) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Ventas por Día
            </h2>
            <div className="space-y-4">
                {data.charts.salesByDay.map((sale, index) => (
                    <div key={index} className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-24">{formatDate(sale.day)}</span>
                        <div className="flex-1 mx-4">
                            <div className="bg-gray-200 rounded-full h-10 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-10 rounded-full flex items-center justify-end px-4 transition-all duration-700 hover:from-blue-600 hover:to-blue-700"
                                    style={{ width: `${(parseFloat(sale.total) / maxSale) * 100}%` }}
                                >
                                    <span className="text-xs font-bold text-white whitespace-nowrap">
                                        {formatCurrency(sale.total)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}