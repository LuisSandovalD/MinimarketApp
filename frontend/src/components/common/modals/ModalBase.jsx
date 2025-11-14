import { motion } from "framer-motion";

export default function ModalBase({
  open,
  onClose,
  title,
  children,
  size = "md", // sm | md | lg
  showClose = true,
}) {
  if (!open) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className={`relative bg-white rounded-2xl shadow-xl w-full ${sizes[size]} p-6`}
      >
        {showClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        )}

        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        {children}
      </motion.div>
    </div>
  );
}
