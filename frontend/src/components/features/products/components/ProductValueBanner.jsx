import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";

export default function ProductValueBanner({ totalValue }) {
    return (
        <div className="mb-3">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-2xl p-6 shadow-lg"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-3 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-lg font-semibold">Valor Total del Inventario:</span>
                    </div>
                    <span className="text-3xl font-bold">
                        S/ {totalValue}
                    </span>
                </div>
            </motion.div>
        </div>
    );
}