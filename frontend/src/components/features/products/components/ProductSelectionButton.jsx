import { motion, AnimatePresence } from "framer-motion";
import { Truck } from "lucide-react";

export default function ProductSelectionButton({ selectedCount, onClick }) {
    return (
        <AnimatePresence>
            {selectedCount > 0 && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={onClick}
                    delay = {0.5}
                    className="fixed bottom-8 right-8 flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full shadow-xl hover:shadow-2xl hover:from-green-600 hover:to-emerald-700 transition-all z-50 font-bold transform hover:scale-105"
                >
                    <Truck size={20} />
                    {selectedCount} 
                </motion.button>
            )}
        </AnimatePresence>
    );
}