import { motion } from "framer-motion";

// Card individual para el producto
const ProductGridCard = ({ item, isSelected, onSelectItem }) => {
    const lowStock = item.stock_current < 3;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`rounded-2xl shadow-sm border border-slate-200 backdrop-blur-sm transition-all
                ${lowStock ? "bg-rose-50 hover:bg-rose-100/70" : "bg-white/70 hover:bg-slate-100/50"}`}
        >
            {/* Título y estado */}
            <div className="flex items-start justify-between p-6 pb-4">
                <h2 className="text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                    {item.name}
                </h2>

                <span
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold border
                        ${item.active
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-rose-100 text-rose-700 border-rose-200"
                        }`}
                >
                    {item.active ? "Activo" : "Inactivo"}
                </span>
            </div>

            {/* Información del producto */}
            <div className="px-6 space-y-3 text-sm">
                <InfoRow label="Código" value={item.code} />
                <InfoRow label="Categoría" value={item.category?.name ?? "—"} />
                <InfoRow label="Unidad" value={item.category?.unit?.abbreviation ?? "—"} />
                <InfoRow label="Precio" value={`S/ ${Number(item.price).toFixed(2)}`} bold />

                {/* Stock */}
                <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500 font-medium">Stock:</span>

                    <span className={`font-bold text-base ${lowStock ? "text-rose-600" : "text-slate-800"}`}>
                        {item.stock_current ?? 0}
                        {lowStock && <span className="ml-2 text-rose-600">⚠️</span>}
                    </span>
                </div>
            </div>

            {/* Selector */}
            <div className="mt-4 p-4 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl flex items-center justify-between">
                <label
                    htmlFor={`select-grid-${item.id}`}
                    className="flex items-center space-x-2 cursor-pointer text-slate-700 font-medium"
                >
                    <input
                        type="checkbox"
                        id={`select-grid-${item.id}`}
                        checked={isSelected}
                        onChange={() => onSelectItem(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-5 w-5 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                    />
                    <span>Seleccionar</span>
                </label>
            </div>
        </motion.div>
    );
};

// Subcomponente para filas de datos
const InfoRow = ({ label, value, bold }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-100">
        <span className="text-slate-500 font-medium">{label}:</span>
        <span className={`text-slate-800 ${bold ? "font-bold" : "font-semibold"}`}>
            {value}
        </span>
    </div>
);

// Componente contenedor en cuadrícula
export default function ProductGrid({ products, selectedItems, onSelectItem }) {
    return (
        <motion.div
            key="grid"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
            {products.map((item) => (
                <ProductGridCard
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.includes(item.id)}
                    onSelectItem={onSelectItem}
                />
            ))}
        </motion.div>
    );
}
