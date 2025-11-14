// src/components/dashboard/TopProducts.jsx

import { Package } from 'lucide-react';

export default function TopProducts({ data, maxProduct }) {
    if (!data?.charts?.topProducts) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-green-600" />
                Top 5 Productos Más Vendidos
            </h2>
            <div className="space-y-4">
                {data.charts.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-sm">
                            {index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-700 flex-1 truncate">{product.name}</span>
                        <div className="w-32">
                            <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-8 rounded-full transition-all duration-700 hover:from-green-600 hover:to-emerald-700"
                                    style={{ width: `${(product.total_quantity / maxProduct) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-12 text-right">
                            {product.total_quantity}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}