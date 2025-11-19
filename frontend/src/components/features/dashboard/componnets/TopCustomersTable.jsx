// src/components/dashboard/TopCustomersTable.jsx

import { Users } from 'lucide-react';
import RestrictedSection from './RestrictedSection'; // Asegúrate de tener la ruta correcta

export default function TopCustomersTable({ data, isAdmin }) {
    if (!data?.charts?.topCustomers) return null;

    return (
        <RestrictedSection isAdmin={isAdmin}>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-600" />
                    Clientes Frecuentes
                    <span className="ml-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                        Solo Admin
                    </span>
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Ranking</th>
                                <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Cliente</th>
                                <th className="text-right py-4 px-4 text-sm font-bold text-gray-700">Total Compras</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.charts.topCustomers.map((customer, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition">
                                    <td className="py-4 px-4">
                                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-sm shadow-md">
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-900 font-medium">{customer.name}</td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 shadow-sm">
                                            {customer.total_sales} compras
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </RestrictedSection>
    );
}