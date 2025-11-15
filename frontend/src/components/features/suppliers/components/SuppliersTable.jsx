import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";

export const SuppliersTable = ({ suppliers, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold text-[#1E293B]">
              Proveedor
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-[#1E293B]">
              RUC
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-[#1E293B]">
              Contacto
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-[#1E293B]">
              Dirección
            </th>
            <th className="px-6 py-4 text-center text-sm font-bold text-[#1E293B]">
              Estado
            </th>
            <th className="px-6 py-4 text-center text-sm font-bold text-[#1E293B]">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier, index) => (
            <motion.tr
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
            >
              {/* Columna: Proveedor */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-center text-[#1E293B] font-bold">
                    {supplier.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <span className="font-semibold text-[#1E293B]">
                    {supplier.name || "Sin nombre"}
                  </span>
                </div>
              </td>

              {/* Columna: RUC */}
              <td className="px-6 py-4">
                <span className="text-[#64748B] font-medium">
                  {supplier.ruc || "—"}
                </span>
              </td>

              {/* Columna: Contacto */}
              <td className="px-6 py-4">
                <div className="space-y-1">
                  {supplier.phone && (
                    <a
                      href={`tel:+51${supplier.phone}`}
                      className="flex items-center gap-2 text-[#64748B] hover:text-[#1E293B] transition-colors"
                    >
                      <Phone size={14} />
                      <span className="text-sm">{supplier.phone}</span>
                    </a>
                  )}
                  {supplier.email && (
                    <a
                      href={`mailto:${supplier.email}`}
                      className="flex items-center gap-2 text-[#64748B] hover:text-[#1E293B] transition-colors"
                    >
                      <Mail size={14} />
                      <span className="text-sm truncate max-w-[200px]">
                        {supplier.email}
                      </span>
                    </a>
                  )}
                  {!supplier.phone && !supplier.email && (
                    <span className="text-[#94A3B8] text-sm italic">
                      Sin contacto
                    </span>
                  )}
                </div>
              </td>

              {/* Columna: Dirección */}
              <td className="px-6 py-4">
                {supplier.address ? (
                  <div className="flex items-start gap-2 text-[#64748B]">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                    <span className="text-sm line-clamp-2">
                      {supplier.address}
                    </span>
                  </div>
                ) : (
                  <span className="text-[#94A3B8] text-sm italic">—</span>
                )}
              </td>

              {/* Columna: Estado */}
              <td className="px-6 py-4 text-center">
                {supplier.active ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                    <CheckCircle size={14} className="text-green-600" />
                    <span className="text-xs font-semibold text-green-700">
                      Activo
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full">
                    <XCircle size={14} className="text-gray-500" />
                    <span className="text-xs font-semibold text-gray-600">
                      Inactivo
                    </span>
                  </span>
                )}
              </td>

              {/* Columna: Acciones */}
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(supplier)}
                    className="p-2 hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] rounded-lg transition-all"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(supplier)}
                    className="p-2 hover:bg-red-50 border border-red-200 text-red-600 rounded-lg transition-all"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);