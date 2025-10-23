import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import { getSales, deleteSales } from "../../../api/sales";
import { getUserRegister } from "../../../api/user";
import { getCustomerRegister } from "../../../api/customer";
import { getPayment } from "../../../api/paymentMethod";
import { getDocument } from "../../../api/document";
import ModalSales from "../../../components/modals/ModalSales";
import ModalDocuments from "../../../components/modals/ModalDocuments";
import Loading from "../../../components/common/Loading";

import {
  Plus,
  Edit,
  Trash2,
  CreditCard,
  FileText,
  Wallet,
  TrendingUp,
  Calendar,
  User,
  Package,
  Search,
  AlertCircle,
  DollarSign,
  Receipt,
} from "lucide-react";

// ========== COMPONENTES REUTILIZABLES ==========

const StatCard = ({ icon: Icon, label, value, sublabel }) => (
  <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-all duration-300">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
        <Icon className="text-[#64748B]" size={22} />
      </div>
      <div>
        <p className="text-sm text-[#64748B] font-semibold mb-1">{label}</p>
        <p className="text-2xl font-bold text-[#1E293B]">{value}</p>
        {sublabel && <p className="text-xs text-[#94A3B8] mt-1">{sublabel}</p>}
      </div>
    </div>
  </div>
);

const SaleRow = ({ sale, onEdit, onDelete, onViewDocument, index }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="hover:bg-[#F8FAFC] transition-all"
    >
      <td className="p-4 border-b border-[#E2E8F0] font-bold text-[#1E293B]">
        {sale.sale_number}
      </td>
      <td className="p-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F8FAFC] rounded-lg flex items-center justify-center border border-[#E2E8F0]">
            <User size={14} className="text-[#64748B]" />
          </div>
          <span className="text-sm font-medium text-[#1E293B]">
            {sale.customer?.name || "—"}
          </span>
        </div>
      </td>
      <td className="p-4 border-b border-[#E2E8F0] text-sm text-[#64748B]">
        {sale.user?.name || "—"}
      </td>
      <td className="p-4 border-b border-[#E2E8F0]">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#1E293B]">
          <Wallet size={12} />
          {sale.payment_method?.name || "—"}
        </span>
      </td>
      <td className="p-4 border-b border-[#E2E8F0] text-sm text-[#64748B]">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          {new Date(sale.date).toLocaleDateString("es-PE")}
        </div>
      </td>
      <td className="p-4 border-b border-[#E2E8F0]">
        {sale.credit ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-bold">
            <CreditCard size={12} />
            Crédito ({sale.credit.interest_rate}%)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold">
            <DollarSign size={12} />
            Contado
          </span>
        )}
      </td>
      <td className="p-4 border-b border-[#E2E8F0] text-right text-sm text-[#64748B]">
        S/ {Number(sale.subtotal).toFixed(2)}
      </td>
      <td className="p-4 border-b border-[#E2E8F0] text-right text-sm text-[#64748B]">
        S/ {Number(sale.vat).toFixed(2)}
      </td>
      <td className="p-4 border-b border-[#E2E8F0] text-right">
        <div>
          <span className="text-sm font-bold text-[#1E293B]">
            S/ {Number(sale.total).toFixed(2)}
          </span>
          {sale.credit && (
            <div className="text-xs text-amber-600 mt-1">
              + Int: S/ {Number(sale.credit.interest_amount || 0).toFixed(2)}
            </div>
          )}
        </div>
      </td>
      <td className="p-4 border-b border-[#E2E8F0]">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onEdit(sale)}
            className="p-2 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg transition-all group"
            title="Editar"
          >
            <Edit size={16} className="text-[#64748B] group-hover:text-blue-600" />
          </button>
          <button
            onClick={() => onDelete(sale.id)}
            className="p-2 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition-all group"
            title="Eliminar"
          >
            <Trash2 size={16} className="text-[#64748B] group-hover:text-red-600" />
          </button>
          <button
            onClick={() => onViewDocument(sale.id)}
            className="p-2 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 rounded-lg transition-all group"
            title="Ver comprobante"
          >
            <FileText size={16} className="text-[#64748B] group-hover:text-emerald-600" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#E2E8F0]"
  >
    <div className="w-20 h-20 bg-[#F8FAFC] rounded-2xl flex items-center justify-center mb-6 border border-[#E2E8F0]">
      <Receipt size={40} className="text-[#94A3B8]" />
    </div>
    <h3 className="text-xl font-bold text-[#1E293B] mb-2">No hay ventas registradas</h3>
    <p className="text-[#64748B] text-center max-w-md">
      Comienza agregando tu primera venta usando el botón "Nueva Venta".
    </p>
  </motion.div>
);

// ========== COMPONENTE PRINCIPAL ==========

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null });

  const fetchSales = async () => {
    try {
      const res = await getSales();
      const salesData = res?.data || res || [];
      setSales(salesData);
      setFiltered(salesData);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      setError("Error al cargar las ventas");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedData = async () => {
    try {
      const [usersRes, customersRes, paymentsRes, documentRes] = await Promise.all([
        getUserRegister(),
        getCustomerRegister(),
        getPayment(),
        getDocument(),
      ]);
      setUsers(usersRes?.data || usersRes || []);
      setCustomers(customersRes?.data || customersRes || []);
      setPaymentMethod(paymentsRes?.data || paymentsRes || []);
      setDocuments(documentRes?.data || documentRes || []);
    } catch (error) {
      console.error("Error al obtener datos relacionados:", error);
    }
  };

  const confirmDelete = (id) => setConfirmModal({ show: true, id });

  const handleDelete = async () => {
    try {
      await deleteSales(confirmModal.id);
      await fetchSales();
      setConfirmModal({ show: false, id: null });
    } catch (error) {
      console.error("Error al eliminar venta:", error);
    }
  };

  const handleDocuments = (saleId) => {
    const doc = documents.find((d) => d.sale_id === saleId);
    const sale = sales.find((s) => s.id === saleId);
    if (!doc) return alert("No hay documento asociado a esta venta.");
    setSelectedDocument({ ...doc, sale });
    setShowDocumentModal(true);
  };

  const handleEdit = (sale) => {
    const normalizedSale = {
      ...sale,
      details: (sale.details || []).map((detail) => ({
        product_id: detail.product_id,
        product_name: detail.product?.name || "",
        quantity: Number(detail.quantity) || 1,
        unit_price: Number(detail.unit_price) || 0,
        total_price: Number(detail.subtotal) || 0,
        code: detail.product?.code || "",
      })),
      is_credit: !!sale.credit,
      interest_rate: sale.credit?.interest_rate || 0,
      due_date: sale.credit?.due_date?.slice(0, 10) || "",
    };
    setSelectedSale(normalizedSale);
    setShowSaleModal(true);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filteredData = sales.filter(
      (s) =>
        s.sale_number?.toString().toLowerCase().includes(value) ||
        s.customer?.name?.toLowerCase().includes(value) ||
        s.user?.name?.toLowerCase().includes(value)
    );
    setFiltered(filteredData);
  };

  useEffect(() => {
    fetchSales();
    fetchRelatedData();
  }, []);

  if (loading) return <Loading />;

  const totalSales = sales.reduce((sum, s) => sum + Number(s.total), 0);
  const creditSales = sales.filter((s) => s.credit);
  const totalCredit = creditSales.reduce(
    (sum, s) => sum + Number(s.total) + Number(s.credit?.interest_amount || 0),
    0
  );
  const totalCash = totalSales - creditSales.reduce((sum, s) => sum + Number(s.total), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16 lg:pt-0">
      <NavBarAdmin />
      <div className="flex-1 lg:ml-72 pt-20 lg:pt-0 p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E293B] mb-1">Gestión de Ventas</h1>
              <p className="text-[#64748B]">Administra todas tus ventas y transacciones</p>
            </div>
            <button
              onClick={() => {
                setSelectedSale(null);
                setShowSaleModal(true);
              }}
              className="flex items-center gap-2 px-5 py-3 bg-[#CBD5E1] hover:bg-[#94A3B8] text-[#1E293B] rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
            >
              <Plus size={20} />
              Nueva Venta
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard
              icon={TrendingUp}
              label="Ventas Totales"
              value={`S/ ${totalSales.toFixed(2)}`}
              sublabel={`${sales.length} ventas registradas`}
            />
            <StatCard
              icon={CreditCard}
              label="Ventas a Crédito"
              value={`S/ ${totalCredit.toFixed(2)}`}
              sublabel={`${creditSales.length} ventas a crédito`}
            />
            <StatCard
              icon={Wallet}
              label="Ventas al Contado"
              value={`S/ ${totalCash.toFixed(2)}`}
              sublabel={`${sales.length - creditSales.length} ventas al contado`}
            />
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={20} />
            <input
              type="text"
              placeholder="Buscar por número de venta, cliente o vendedor..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 border border-[#E2E8F0] rounded-xl bg-white text-[#1E293B] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#CBD5E1] focus:border-[#CBD5E1] outline-none transition-all"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          search ? (
            <div className="text-center py-20">
              <p className="text-[#64748B] text-lg">
                No se encontraron ventas con "{search}"
              </p>
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="p-4 text-left text-sm font-bold text-[#1E293B]">N° Venta</th>
                    <th className="p-4 text-left text-sm font-bold text-[#1E293B]">Cliente</th>
                    <th className="p-4 text-left text-sm font-bold text-[#1E293B]">Vendedor</th>
                    <th className="p-4 text-left text-sm font-bold text-[#1E293B]">Método de Pago</th>
                    <th className="p-4 text-left text-sm font-bold text-[#1E293B]">Fecha</th>
                    <th className="p-4 text-left text-sm font-bold text-[#1E293B]">Tipo</th>
                    <th className="p-4 text-right text-sm font-bold text-[#1E293B]">Subtotal</th>
                    <th className="p-4 text-right text-sm font-bold text-[#1E293B]">IGV</th>
                    <th className="p-4 text-right text-sm font-bold text-[#1E293B]">Total</th>
                    <th className="p-4 text-center text-sm font-bold text-[#1E293B]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((sale, index) => (
                      <SaleRow
                        key={sale.id}
                        sale={sale}
                        index={index}
                        onEdit={handleEdit}
                        onDelete={confirmDelete}
                        onViewDocument={handleDocuments}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === Modal de Confirmación === */}
        <AnimatePresence>
          {confirmModal.show && (
            <motion.div
              className="fixed inset-0 bg-[#1E293B]/40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 border border-[#E2E8F0] text-center"
              >
                <h2 className="text-lg font-semibold text-[#1E293B] mb-2">
                  Confirmar eliminación
                </h2>
                <p className="text-sm text-[#64748B] mb-6">
                  ¿Seguro que deseas eliminar esta venta? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => setConfirmModal({ show: false, id: null })}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-[#1E293B] rounded-lg font-semibold transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* === Modales === */}
        <ModalSales
          show={showSaleModal}
          onClose={() => {
            setShowSaleModal(false);
            setSelectedSale(null);
          }}
          onSaved={() => {
            fetchSales();
            setShowSaleModal(false);
            setSelectedSale(null);
          }}
          users={users}
          customers={customers}
          paymentMethod={paymentMethod}
          sale={selectedSale}
          editing={!!selectedSale}
        />

        <ModalDocuments
          show={showDocumentModal}
          doc={selectedDocument}
          onClose={() => {
            setShowDocumentModal(false);
            setSelectedDocument(null);
          }}
        />
      </div>
    </div>
  );
};

export default SalesList;
