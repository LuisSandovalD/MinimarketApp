import { motion } from "framer-motion";
import { 
  Phone, Mail, MapPin, CreditCard, CheckCircle, 
  XCircle, Edit, ShoppingBag, Trash2 
} from "lucide-react";

export default function CustomersTable({
  currentCustomers = [],
  getCustomerCredits,
  setSelectedCustomer,
  setModalOpen,
  setSelectedCustomerSales,
  setModalSalesOpen,
  setSelectedCustomerCredits,
  setModalCreditsOpen,
  handleDeleteCustomer
}) {
  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Cliente</th>
          <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">DNI/RUC</th>
          <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Contacto</th>
          <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Dirección</th>
          <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Créditos</th>
          <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Estado</th>
          <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {currentCustomers.map((customer, index) => {
          const customerCredit = getCustomerCredits(customer.id);
          const hasPendingCredits =
            customerCredit && customerCredit.pendingCredits.length > 0;

          return (
            <motion.tr
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {/* Cliente */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                    {customer.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <span className="font-semibold text-gray-900">{customer.name}</span>
                </div>
              </td>

              {/* DNI/RUC */}
              <td className="px-6 py-4">
                <span className="text-gray-600 font-medium">
                  {customer.dni_ruc || "—"}
                </span>
              </td>

              {/* Contacto */}
              <td className="px-6 py-4">
                <div className="space-y-1">
                  {customer.phone && (
                    <a
                      href={`tel:+51${customer.phone}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Phone size={14} />
                      <span className="text-sm">{customer.phone}</span>
                    </a>
                  )}

                  {customer.email && (
                    <a
                      href={`mailto:${customer.email}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Mail size={14} />
                      <span className="text-sm truncate max-w-[200px]">
                        {customer.email}
                      </span>
                    </a>
                  )}

                  {!customer.phone && !customer.email && (
                    <span className="text-gray-400 text-sm italic">Sin contacto</span>
                  )}
                </div>
              </td>

              {/* Dirección */}
              <td className="px-6 py-4">
                {customer.address ? (
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                    <span className="text-sm line-clamp-2">{customer.address}</span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm italic">—</span>
                )}
              </td>

              {/* Créditos */}
              <td className="px-6 py-4">
                {hasPendingCredits ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-cyan-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        {customerCredit.pendingCredits.length} crédito
                        {customerCredit.pendingCredits.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600">
                      Total:{" "}
                      <span className="font-bold text-cyan-600">
                        S/ {customerCredit.totalWithInterest.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm italic">Sin créditos</span>
                )}
              </td>

              {/* Estado */}
              <td className="px-6 py-4 text-center">
                {customer.active ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                    <CheckCircle size={14} className="text-green-600" />
                    <span className="text-xs font-semibold text-green-700">Activo</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full">
                    <XCircle size={14} className="text-gray-500" />
                    <span className="text-xs font-semibold text-gray-600">Inactivo</span>
                  </span>
                )}
              </td>

              {/* Acciones */}
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setModalOpen(true);
                    }}
                    className="p-2 hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-lg transition-all"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCustomerSales(customer);
                      setModalSalesOpen(true);
                    }}
                    className="p-2 hover:bg-blue-50 border border-blue-200 text-blue-600 rounded-lg transition-all"
                    title="Ver Ventas"
                  >
                    <ShoppingBag size={18} />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCustomerCredits(customer);
                      setModalCreditsOpen(true);
                    }}
                    className="p-2 hover:bg-cyan-50 border border-cyan-200 text-cyan-600 rounded-lg transition-all"
                    title="Ver Créditos"
                  >
                    <CreditCard size={18} />
                  </button>

                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="p-2 hover:bg-red-50 border border-red-200 text-red-600 rounded-lg transition-all"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </motion.tr>
          );
        })}
      </tbody>
    </table>
  );
}
