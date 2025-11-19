export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  icon: Icon,
  error,
  variant = "light", // 'light' | 'dark'
  autoFocus = false,
  className = "",
}) {
  const baseStyle =
    "w-full rounded-lg border p-3 transition-all duration-200 focus:outline-none focus:ring-2";

  const variants = {
    light:
      "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400",
    dark:
      "bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-white/50 focus:ring-white/40 focus:border-white/40",
  };

  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label
          htmlFor={name}
          className={`text-sm font-medium ${
            variant === "light" ? "text-gray-700" : "text-white/80"
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <Icon
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              variant === "light" ? "text-gray-400" : "text-white/60"
            } group-focus-within:text-blue-500 transition-colors`}
          />
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          className={`${baseStyle} ${variants[variant]} ${
            Icon ? "pl-10" : "pl-3"
          } ${className}`}
        />
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
