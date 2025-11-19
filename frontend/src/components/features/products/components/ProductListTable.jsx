import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Fila de tabla como componente reutilizable
const TableRow = ({ item, isSelected, onSelectItem }) => {
    const lowStock = item.stock_current < 3;

    return (
        <motion.tr
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
            className={`transition-colors ${
                lowStock 
                    ? "bg-rose-50/40 hover:bg-rose-50/60" 
                    : "hover:bg-sky-50/50"
            }`}
        >
            <td className="px-6 py-4 whitespace-nowrap w-1" onClick={(e) => e.stopPropagation()}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectItem(item.id)}
                    className="h-4 w-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                />
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-slate-800">{item.name}</div>

                {/* Info compacta para móviles */}
                <div className="text-xs text-slate-500 mt-1 sm:hidden">
                    {item.code} | {item.category?.name ?? "—"}
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 hidden sm:table-cell">
                {item.code}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 hidden md:table-cell">
                {item.category?.name ?? "—"}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-slate-700">
                S/ {Number(item.price).toFixed(2)}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                <span className={`font-bold ${lowStock ? "text-rose-600" : "text-slate-800"}`}>
                    {item.stock_current ?? 0}
                </span>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-center">
                <span
                    className={`
                        px-3 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${item.active ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}
                    `}
                >
                    {item.active ? "Activo" : "Inactivo"}
                </span>
            </td>
        </motion.tr>
    );
};

// Componente principal
export default function ProductListTable({
    products,
    selectedItems,
    setSelectedItems,
    onSelectItem
}) {
    const navigate = useNavigate();

    const handleSelectAll = () => {
        const allIds = products.map(p => p.id);

        if (selectedItems.length === products.length) {
            // Desmarcar todos
            setSelectedItems(prev => prev.filter(id => !allIds.includes(id)));
        } else {
            // Marcar todos sin duplicar
            setSelectedItems(prev => [...new Set([...prev, ...allIds])]);
        }
    };

    return (
        <motion.div
            key="list"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
        >
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50/70">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-1">
                                <input
                                    type="checkbox"
                                    checked={products.length > 0 && selectedItems.length === products.length}
                                    onChange={handleSelectAll}
                                    className="h-4 w-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Producto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                                Código
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                                Categoría
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Precio (S/)
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Estado
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        <AnimatePresence>
                            {products.map((item) => (
                                <TableRow
                                    key={item.id}
                                    item={item}
                                    isSelected={selectedItems.includes(item.id)}
                                    onSelectItem={onSelectItem}
                                />
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}