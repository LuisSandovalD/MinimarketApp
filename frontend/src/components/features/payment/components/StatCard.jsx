import React from "react";

export const StatCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-100",
      icon: "text-blue-600",
      text: "text-slate-800",
    },
    green: {
      bg: "bg-green-100",
      icon: "text-green-600",
      text: "text-green-600",
    },
    orange: {
      bg: "bg-orange-100",
      icon: "text-orange-600",
      text: "text-orange-600",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className={`text-2xl font-bold ${colors.text} mt-1`}>{value}</p>
        </div>
        <div className={`${colors.bg} p-3 rounded-lg`}>
          <Icon className={colors.icon} size={24} />
        </div>
      </div>
    </div>
  );
};