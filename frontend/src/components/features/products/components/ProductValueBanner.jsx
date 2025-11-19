import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";

export default function ProductValueBanner({ totalValue }) {
    return (
        <div className="mb-3">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 border border-blue-800/10 rounded-2xl p-6 shadow bg-blue-50/50"
                delay = {0.1}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-900 p-3 rounded-xl text-white">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-lg text-blue-800">Total del Inventario:</span>
                    </div>
                    <span className="lg:text-3xl sm:text-1xl font-bold text-blue-800">
                        S/ {totalValue}
                    </span>
                </div>
            </motion.div>
        </div>
    );
}