export default function IconButton({
  label,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  children, // si quieres pasar un ícono SVG propio o texto
}) {
  const sizes = {
    sm: "p-2 text-sm",
    md: "p-3 text-base",
    lg: "p-4 text-lg",
  };

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 rounded-full",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 disabled:opacity-60 rounded-full",
    danger:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:opacity-60 rounded-full",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${sizes[size]} ${variants[variant]} flex items-center justify-center`}
      title={label}
    >
      {children || label}
    </button>
  );
}
