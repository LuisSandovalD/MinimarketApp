import React from "react";

export const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
      <Icon className="text-gray-400" size={32} />
    </div>
  </div>
);