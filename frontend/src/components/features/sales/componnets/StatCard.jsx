import { motion } from "framer-motion";

const StatCard = ({ icon: Icon, label, value, sublabel, color = "slate" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gradient-to-br from-white to-${color}-50 rounded-xl border border-${color}-200 p-5 hover:shadow-lg transition-all duration-300`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 bg-${color}-100 rounded-xl border border-${color}-200`}>
        <Icon className={`text-${color}-600`} size={22} />
      </div>
      <div>
        <p className="text-sm text-slate-600 font-semibold mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        {sublabel && <p className="text-xs text-slate-500 mt-1">{sublabel}</p>}
      </div>
    </div>
  </motion.div>
);

export default StatCard;
