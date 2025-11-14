export default function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-[#E2E8F0]">
        <p className="font-bold text-[#1E293B] text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-[#64748B] text-sm">
            <span className="font-black text-[#1E293B]">
              ${entry.value?.toLocaleString()}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}
