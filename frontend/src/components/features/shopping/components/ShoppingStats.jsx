import { Package, ShoppingCart, BarChart2 } from "lucide-react";

export default function ShoppingStats({ stats, count }) {
  const cards = [
    {
      title: "Total de compras",
      value: count,
      description: "Compras registradas",
      bg: "bg-blue-500",
      icon: Package
    },
    {
      title: "Monto total",
      value: `S/ ${Number(stats.total).toFixed(2)}`,
      description: "Monto acumulado",
      bg: "bg-green-500",
      icon: ShoppingCart
    },
    {
      title: "Promedio por compra",
      value: `S/ ${Number(stats.average).toFixed(2)}`,
      description: "Promedio general",
      bg: "bg-amber-500",
      icon: BarChart2
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((c, idx) => {
        const Icon = c.icon;

        return (
          <div
            key={idx}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${c.bg}`}>
                <Icon className="text-white" size={22} />
              </div>

              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">
                  {c.title}
                </p>

                <p className="text-2xl font-bold text-gray-900">
                  {c.value}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {c.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
