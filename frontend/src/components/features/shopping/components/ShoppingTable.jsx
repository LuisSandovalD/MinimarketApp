import React, { useState } from "react";
import { ChevronDown, ChevronUp, Edit2, Trash2, Search, SlidersHorizontal } from "lucide-react";
import ShoppingFilters from "./ShoppingFilters";

export default function ShoppingTable({
  data = [],
  onEdit = () => {},
  onDelete = () => {},
  onToggleFilters,
  searchValue,
  onSearchChange,
  onFilterChange,
  suppliers,
  showAdvancedFilters,
  users,
  onClear,
}) {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleExpand = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* 🔎 Buscador + Botón Filtros */}
      <div className="grid md:flex-row md:items-center gap-3 p-4 bg-white rounded-2xl mb-4">
        <div className="flex justify-between w-full items-center gap-3">

          {/* 🔍 Input con icono */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Buscar compras..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 
                        focus:ring-2 focus:ring-sky-300 focus:border-sky-400 
                        outline-none transition-all shadow-sm"
            />
          </div>

          {/* Botón Filtros con icono */}
          <button
            onClick={onToggleFilters}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 
                       rounded-xl hover:bg-slate-50 hover:border-slate-400 
                       transition-all shadow-sm font-medium text-slate-700"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {/* Filtros avanzados */}
        {showAdvancedFilters && (
          <ShoppingFilters
            filters={onSearchChange}
            onFilterChange={onFilterChange}
            suppliers={suppliers}
            users={users}
            onClear={onClear}
          />
        )}
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 border-b-2 border-slate-200">
            <tr>
              <th className="py-4 px-6 text-left font-semibold text-slate-700"># Compra</th>
              <th className="py-4 px-6 text-left font-semibold text-slate-700">Proveedor</th>
              <th className="py-4 px-6 text-left font-semibold text-slate-700">Usuario</th>
              <th className="py-4 px-6 text-left font-semibold text-slate-700">Fecha</th>
              <th className="py-4 px-6 text-left font-semibold text-slate-700">Total (S/.)</th>
              <th className="py-4 px-6 text-center font-semibold text-slate-700">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">

            {/* 🔥 NO HAY RESULTADOS */}
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500 text-sm">
                  No se encontraron compras
                </td>
              </tr>
            )}

            {/* 🔥 LISTA NORMAL */}
            {data.map((item, index) => {
              const isExpanded = expandedRow === item.id;

              return (
                <React.Fragment key={item.id}>
                  {/* FILA PRINCIPAL */}
                  <tr
                    onClick={() => toggleExpand(item.id)}
                    className={`hover:bg-sky-50/70 cursor-pointer transition-all duration-200 ${
                      isExpanded
                        ? "bg-sky-50/70"
                        : index % 2 === 0
                        ? "bg-white"
                        : "bg-slate-50/40"
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-sky-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="font-semibold text-sky-700">
                          {item.shopping_number}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-medium text-slate-700">
                      {item.supplier?.name ?? "—"}
                    </td>

                    <td className="py-4 px-6 text-slate-600">
                      {item.user?.name ?? "—"}
                    </td>

                    <td className="py-4 px-6 text-slate-600">{item.date ?? "—"}</td>

                    <td className="py-4 px-6">
                      <span className="font-bold text-lg text-emerald-600">
                        S/ {typeof item.total === "number" ? item.total.toFixed(2) : item.total}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">

                        {/* Botón Editar */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium 
                                     bg-sky-500 text-white rounded-lg hover:bg-sky-600 
                                     hover:shadow-md transition-all"
                          type="button"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Editar
                        </button>

                        {/* Botón Eliminar */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium 
                                     bg-rose-500 text-white rounded-lg hover:bg-rose-600 
                                     hover:shadow-md transition-all"
                          type="button"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* FILA EXPANDIDA */}
                  {isExpanded && Array.isArray(item.details) && (
                    <tr className="bg-gradient-to-r from-sky-50/40 to-slate-50/40">
                      <td colSpan={6} className="p-6">
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                          <div className="flex items-center gap-2 mb-5">
                            <div className="w-1 h-6 bg-sky-500 rounded-full" />
                            <h3 className="text-base font-bold text-slate-800">Productos Comprados</h3>
                          </div>

                          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                            <table className="w-full text-xs">
                              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                                <tr className="text-slate-700 uppercase text-[11px] font-semibold">
                                  <th className="py-3 px-4 text-left">Producto</th>
                                  <th className="py-3 px-4 text-center">Cantidad</th>
                                  <th className="py-3 px-4 text-center">Precio Unit.</th>
                                  <th className="py-3 px-4 text-center">Subtotal</th>
                                </tr>
                              </thead>

                              <tbody className="divide-y divide-slate-200">
                                {item.details.map((d, i) => (
                                  <tr
                                    key={i}
                                    className={`hover:bg-sky-50/70 transition-colors ${
                                      i % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                                    }`}
                                  >
                                    <td className="py-3 px-4 font-medium text-slate-700">
                                      {d.product?.name ?? "—"}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      <span className="inline-block bg-sky-100 text-sky-700 px-3 py-1 rounded-full font-semibold">
                                        {Math.round(d.quantity ?? 0)}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-center text-slate-600">
                                      S/ {typeof d.unit_price === "number" ? d.unit_price.toFixed(2) : d.unit_price}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      <span className="font-bold text-emerald-600">
                                        S/ {typeof d.subtotal === "number" ? d.subtotal.toFixed(2) : d.subtotal}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
