// src/components/dashboard/DashboardMetrics.jsx

import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import MetricCard from './MetricCard'; // Importación local

export default function DashboardMetrics({ data, isAdmin, formatCurrency }) {
    const commonMetrics = [
        {
            title: "Ventas Totales",
            dataKey: "ventas",
            icon: DollarSign,
            iconBg: "bg-green-100",
            iconColor: "text-green-600"
        },
        // Compras es condicional
        {
            title: "Total Clientes",
            dataKey: "clientes",
            icon: Users,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600"
        },
        {
            title: "Total Productos",
            dataKey: "productos",
            icon: Package,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            hideTrend: true // No tiene variación en tu código
        },
    ];

    // Métrica de compras (solo admin)
    const purchaseMetric = {
        title: "Compras Totales",
        dataKey: "compras",
        icon: ShoppingCart,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600"
    };

    const metricsToRender = [...commonMetrics];
    if (isAdmin) {
        // Insertar Compras después de Ventas
        metricsToRender.splice(1, 0, purchaseMetric);
    }
    
    // El grid cambia dinámicamente: 4 columnas si es admin, 3 si no.
    const gridLayout = isAdmin ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-3 lg:grid-cols-3";

    return (
        <div className={`${gridLayout} gap-6 mb-6 grid grid-col-4`}>
            {metricsToRender.map((metric, index) => {
                const summary = data.summary[metric.dataKey];
                const value = metric.dataKey === "productos" || metric.dataKey === "clientes"
                    ? summary.total
                    : formatCurrency(summary.total);

                return (
                    <MetricCard
                        key={index}
                        title={metric.title}
                        value={value}
                        icon={metric.icon}
                        trend={summary.variacion >= 0 ? 'up' : 'down'}
                        trendValue={summary.variacion}
                        iconBg={metric.iconBg}
                        iconColor={metric.iconColor}
                        hideTrend={metric.hideTrend}
                    />
                );
            })}
        </div>
    );
}