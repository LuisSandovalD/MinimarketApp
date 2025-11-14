import { Users, Shield } from "lucide-react";

export default function UserStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-lg transition-all">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500 rounded-xl">
            <Users className="text-white" size={22} />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Total Usuarios</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      {Object.entries(stats.byRole).slice(0, 3).map(([role, count], index) => {
        const colors = [
          "bg-green-500",
          "bg-purple-500",
          "bg-cyan-500",
        ];
        const color = colors[index] || colors[0];

        return (
          <div key={role} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className={`p-3 ${color} rounded-xl`}>
                <Shield className="text-white" size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1 capitalize">{role}</p>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}