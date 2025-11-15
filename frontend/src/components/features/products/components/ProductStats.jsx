import { motion } from "framer-motion";
import { Package, Box } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, iconBg, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay }}
        className="rounded-2xl p-6 shadow hover:shadow-md transition-all"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs text-slate-500 font-medium mb-1.5">{title}</p>
                <p className={`text-2xl font-bold ${value > 0 && title === "Stock Crítico" ? "text-rose-600" : "text-slate-800"}`}>
                    {value}
                </p>
            </div>
            <div className={`p-3 rounded-xl ${iconBg}`}>
                <Icon size={24} />
            </div>
        </div>
    </motion.div>
);

export default function ProductStats({ stats }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard 
                title="Total Productos" 
                value={stats.total} 
                icon={Package} 
                iconBg="bg-sky-100 text-sky-600" 
                delay={0.1}
                />
            <StatCard 
                title="Activos" 
                value={stats.active} 
                icon={() => <div className="w-6 h-6 bg-emerald-500 rounded-full" />} 
                iconBg="bg-emerald-100" 
                delay={0.2}
                />
            <StatCard 
                title="Inactivos" 
                value={stats.inactive} 
                icon={() => <div className="w-6 h-6 bg-rose-500 rounded-full" />} 
                iconBg="bg-rose-100" 
                delay={0.3}
                />
            <StatCard 
                title="Stock Crítico"
                value={stats.lowStock} 
                icon={Box} 
                iconBg="bg-amber-100 text-amber-600" 
                delay={0.4}
                />
        </div>
    );
}