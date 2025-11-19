export default function UserAvatar({
  size = "md",
  gradient = "from-blue-500 to-indigo-600",
  border = true,
  icon: IconComponent,
}) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-36 h-36",
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center shadow-2xl ${
        border ? "border-4 border-white/20" : ""
      }`}
    >
      {IconComponent && (
        <IconComponent className="text-white w-1/2 h-1/2" strokeWidth={1.5} />
      )}
    </div>
  );
}
