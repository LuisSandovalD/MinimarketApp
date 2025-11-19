export default function SidebarButton({
  icon: Icon,
  label,
  subLabel,
}) {
  return (
    <div className="flex items-center gap-3">
      {/* Ícono principal del sistema */}
      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200/40">
        {Icon && <Icon size={18} className="text-white" />}
      </div>

      {/* Texto y subtítulo */}
      <div className="flex flex-col leading-tight">
        <h1 className="text-sm font-semibold text-gray-800">{label}</h1>
        {subLabel && (
          <p className="text-xs text-gray-500 capitalize mt-0.5">
            {subLabel}
          </p>
        )}
      </div>
    </div>
  );
}
