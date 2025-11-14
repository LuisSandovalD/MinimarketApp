// src/components/features/products/components/ProductHeader.jsx
import { ShoppingBagIcon } from "lucide-react";
import NotificationButton from "@/components/common/buttons/NotificationButton";
import ProductExportMenu from "./ProductExportMenu";

export default function ProductHeader({ products }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
          <ShoppingBagIcon className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-slate-800">Lista de Productos</h2>
          <p className="text-sm text-slate-500 mt-1">Gestiona y visualiza tu inventario</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ProductExportMenu products={products} />
        <NotificationButton />
      </div>
    </div>
  );
}
