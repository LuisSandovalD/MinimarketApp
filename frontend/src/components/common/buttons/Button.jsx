export default function Button({
  children,
  type = "button",
  onClick,
  variant = "primary",
  disabled = false,
  fullWidth = false,
  className = "",
}) {
  const base =
    "p-4 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 disabled:opacity-60",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-300 disabled:opacity-60",
    danger:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 disabled:opacity-60",
    success:
      "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500 disabled:opacity-60",
    outline:
      "border border-gray-400 text-gray-700 hover:bg-gray-100 focus:ring-gray-300 disabled:opacity-60",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}
