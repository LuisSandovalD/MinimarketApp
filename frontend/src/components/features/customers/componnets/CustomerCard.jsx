export default function CustomerCard({ Icon, label, value, color }){
    return(
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-4">
        <div className={`p-3 ${color} rounded-xl`}>
            <Icon className="text-white" size={22} />
        </div>
        <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        </div>
    </div>
    );
}