import { ShoppingCart, Package, Box, ChevronDown, ChevronUp } from "lucide-react";

export const GroupHeader = ({ 
  shoppingId, 
  shopping, 
  items, 
  groupTotal, 
  groupItems, 
  isExpanded, 
  toggleGroup 
}) => {
  return (
    <button
      onClick={() => toggleGroup(shoppingId)}
      className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-3 rounded-xl shadow-md">
          <ShoppingCart className="text-white" size={24} />
        </div>
        <div className="text-left">
          <h3 className="text-lg font-bold text-slate-800">
            {shopping?.shopping_number || `Compra #${shoppingId}`}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="inline-flex items-center gap-1 text-sm text-slate-600">
              <Package size={14} />
              {items.length} producto{items.length !== 1 ? "s" : ""}
            </span>
            <span className="text-slate-400">•</span>
            <span className="inline-flex items-center gap-1 text-sm text-slate-600">
              <Box size={14} />
              {groupItems.toFixed(2)} items
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm text-slate-600 font-medium mb-1">Total</p>
          <p className="text-2xl font-bold text-emerald-600">
            S/ {groupTotal.toFixed(2)}
          </p>
        </div>
        <div className="bg-slate-100 p-2.5 rounded-lg">
          {isExpanded ? (
            <ChevronUp size={20} className="text-slate-600" />
          ) : (
            <ChevronDown size={20} className="text-slate-600" />
          )}
        </div>
      </div>
    </button>
  );
};

export default GroupHeader;