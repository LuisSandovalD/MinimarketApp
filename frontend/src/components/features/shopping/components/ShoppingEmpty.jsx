
export default function ShoppingEmpty() {
    return (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md py-20 border border-gray-100">
            <h3 className="text-lg font-semibold text-slate-700">No hay compras registradas</h3>
            <p className="text-gray-500 text-sm mt-2">Comienza creando una nueva compra</p>
        </div>
    );
}
