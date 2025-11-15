import { Plus } from "lucide-react";
import { FullscreenButton } from "../../../common/buttons";

export default function ShoppingHeader({onOpenModal}) {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-700 mb-2">Compras registradas</h1>
                <p className="text-sm text-gray-500">Gestión y control de compras realizadas</p>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={() => onOpenModal()}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
                >
                    <Plus size={20} />
                    Nueva Compra
                </button>
                <FullscreenButton className="shadow" />
            </div>
        </div>
    );
}
