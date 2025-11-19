import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

export default function UnitToast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-20 right-4 z-50 flex items-center gap-3 bg-white shadow-xl rounded-lg px-5 py-3 border-l-4"
          style={{
            borderLeftColor:
              toast.type === "success" ? "#10B981" : "#EF4444",
          }}
        >
          {toast.type === "success" ? (
            <CheckCircle className="text-green-500" size={22} />
          ) : (
            <XCircle className="text-red-500" size={22} />
          )}
          <span className="text-sm font-medium text-slate-700">
            {toast.msg}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
