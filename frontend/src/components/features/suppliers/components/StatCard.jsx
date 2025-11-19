import React from "react";

export const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-all duration-300">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
        <Icon className="text-[#64748B]" size={22} />
      </div>
      <div>
        <p className="text-sm text-[#64748B] font-semibold mb-1">{label}</p>
        <p className="text-2xl font-bold text-[#1E293B]">{value}</p>
      </div>
    </div>
  </div>
);