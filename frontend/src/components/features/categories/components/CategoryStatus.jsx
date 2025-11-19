{/* Estadísticas */}
import {Package,CheckCircle,XCircle} from "lucide-react"
export default function CategoryStatus({stats}){
    return(
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500 font-medium">Total</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                    <Package className="text-blue-600" size={24} />
                </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500 font-medium">Activas</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="text-green-600" size={24} />
                </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500 font-medium">Inactivas</p>
                    <p className="text-2xl font-bold text-orange-600 mt-1">{stats.inactive}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                    <XCircle className="text-orange-600" size={24} />
                </div>
                </div>
            </div>
    </div>
    );
}