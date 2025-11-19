import { FileText, Box, DollarSign, ShoppingCart } from "lucide-react";

export const ShoppingDetailStats = ({ stats }) => {
  const statCards = [
    {
      label: "Total Registros",
      value: stats.totalDetails,
      subtitle: "Detalles registrados",
      icon: FileText,
      gradient: "from-sky-500 to-sky-600",
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200",
      textColor: "text-sky-700",
      valueColor: "text-sky-800"
    },
    {
      label: "Total Items",
      value: stats.totalItems,
      subtitle: "Unidades compradas",
      icon: Box,
      gradient: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
      valueColor: "text-emerald-800"
    },
    {
      label: "Valor Total",
      value: `S/ ${stats.totalValue}`,
      subtitle: "En productos",
      icon: DollarSign,
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      valueColor: "text-purple-800"
    },
    {
      label: "Compras",
      value: stats.uniqueShoppings,
      subtitle: `${stats.uniqueProducts} productos únicos`,
      icon: ShoppingCart,
      gradient: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
      valueColor: "text-amber-800"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-xl p-6 border ${stat.borderColor} shadow-sm hover:shadow-md transition-all`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`${stat.textColor} text-sm font-medium mb-1`}>
                {stat.label}
              </p>
              <p className={`text-3xl font-bold ${stat.valueColor}`}>
                {stat.value}
              </p>
              <p className={`text-xs ${stat.textColor} mt-1`}>
                {stat.subtitle}
              </p>
            </div>
            <div className={`bg-gradient-to-br ${stat.gradient} p-4 rounded-xl shadow-md`}>
              <stat.icon className="text-white" size={28} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ShoppingDetailStats;