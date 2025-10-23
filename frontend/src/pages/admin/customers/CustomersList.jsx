import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import { getCustomerRegister, deleteCustomer } from "../../../api/customer";
import ModalCustomer from "../../../components/modals/ModalCustomer";
import ModalCustomerSales from "../../../components/modals/ModalCustomerSales";
import ModalCustomerCredits from "../../../components/modals/ModalCustomerCredits";
import Loading from "../../../components/common/Loading";

import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  ShoppingBag,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// ========== COMPONENTES REUTILIZABLES ==========

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-all duration-300">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
        <Icon className="text-[#64748B]" size={22} />
      </div>
      <div>
        <p className="text-sm text-[#64748B] font-semibold mb-1">{label}</p>
        <p className="text-2xl font-bold text-[#1E293B]">{value}</p>
      </div>
    </div>
  </div>
);

const CustomerCard = ({ customer, onEdit, onViewSales, onViewCredits, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-lg hover:border-[#CBD5E1] transition-all duration-300"
    >
      {/* Header */}
      <div className="bg-[#F8FAFC] p-6 border-b border-[#E2E8F0]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white border-2 border-[#E2E8F0] rounded-xl flex items-center justify-center text-[#1E293B] font-bold text-lg shadow-sm">
              {customer.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1E293B]">{customer.name}</h3>
              <p className="text-sm text-[#64748B] font-medium">
                {customer.dni_ruc || "Sin DNI/RUC"}
              </p>
            </div>
          </div>
          {customer.active ? (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E2E8F0] rounded-full">
              <CheckCircle size={14} className="text-[#10B981]" />
              <span className="text-xs font-semibold text-[#1E293B]">Activo</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E2E8F0] rounded-full">
              <XCircle size={14} className="text-[#94A3B8]" />
              <span className="text-xs font-semibold text-[#64748B]">Inactivo</span>
            </span>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 space-y-3">
        {customer.phone && (
          <div className="flex items-center gap-3 text-[#64748B]">
            <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <Phone size={16} className="text-[#94A3B8]" />
            </div>
            <span className="text-sm font-medium">{customer.phone}</span>
          </div>
        )}

        {customer.email && (
          <div className="flex items-center gap-3 text-[#64748B]">
            <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <Mail size={16} className="text-[#94A3B8]" />
            </div>
            <span className="text-sm font-medium truncate">{customer.email}</span>
          </div>
        )}

        {customer.address && (
          <div className="flex items-center gap-3 text-[#64748B]">
            <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <MapPin size={16} className="text-[#94A3B8]" />
            </div>
            <span className="text-sm font-medium truncate">{customer.address}</span>
          </div>
        )}

        {!customer.phone && !customer.email && !customer.address && (
          <p className="text-sm text-[#94A3B8] italic">Sin información de contacto</p>
        )}
      </div>

      {/* Acciones */}
      <div className="grid grid-cols-2 gap-2 p-4 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <button
          onClick={() => onEdit(customer)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-lg font-semibold text-sm transition-all"
        >
          <Edit size={16} />
          Editar
        </button>

        <button
          onClick={() => onViewSales(customer)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-lg font-semibold text-sm transition-all"
        >
          <ShoppingBag size={16} />
          Ventas
        </button>

        <button
          onClick={() => onViewCredits(customer)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-lg font-semibold text-sm transition-all"
        >
          <CreditCard size={16} />
          Créditos
        </button>

        <button
          onClick={() => onDelete(customer.id)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 border border-[#E2E8F0] hover:border-red-200 text-red-600 rounded-lg font-semibold text-sm transition-all"
        >
          <Trash2 size={16} />
          Eliminar
        </button>
      </div>
    </motion.div>
  );
};

// ========== COMPONENTE PRINCIPAL ==========

export default function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [modalSalesOpen, setModalSalesOpen] = useState(false);
  const [selectedCustomerSales, setSelectedCustomerSales] = useState(null);

  const [modalCreditsOpen, setModalCreditsOpen] = useState(false);
  const [selectedCustomerCredits, setSelectedCustomerCredits] = useState(null);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomerRegister();
      setCustomers(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filteredData = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(value) ||
        (c.dni_ruc && c.dni_ruc.toLowerCase().includes(value))
    );
    setFiltered(filteredData);
  };

  const handleDeleteCustomer = (id) => {
    setCustomerToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await deleteCustomer(customerToDelete);
      await loadCustomers();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar cliente");
    } finally {
      setConfirmOpen(false);
      setCustomerToDelete(null);
    }
  };

  if (loading) return <Loading />;

  const activeCustomers = customers.filter((c) => c.active).length;
  const inactiveCustomers = customers.length - activeCustomers;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16 lg:p-0">
      <NavBarAdmin />

      <div className="flex-1 p-8 ml-0 lg:ml-72 ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E293B] mb-1">Gestión de Clientes</h1>
              <p className="text-[#64748B]">Administra tu cartera de clientes</p>
            </div>

            <button
              onClick={() => {
                setSelectedCustomer(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-3 bg-[#CBD5E1] hover:bg-[#94A3B8] text-[#1E293B] rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
            >
              <UserPlus size={20} />
              Nuevo Cliente
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard icon={Users} label="Total Clientes" value={customers.length} />
            <StatCard icon={CheckCircle} label="Clientes Activos" value={activeCustomers} />
            <StatCard icon={XCircle} label="Clientes Inactivos" value={inactiveCustomers} />
          </div>

          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre o DNI/RUC..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 border border-[#E2E8F0] rounded-xl bg-white text-[#1E293B] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#CBD5E1] focus:border-[#CBD5E1] outline-none transition-all"
            />
          </div>
        </div>

        {/* Lista */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#64748B] text-lg">
            No se encontraron clientes con "{search}"
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onEdit={() => {
                    setSelectedCustomer(customer);
                    setModalOpen(true);
                  }}
                  onViewSales={(c) => {
                    setSelectedCustomerSales(c);
                    setModalSalesOpen(true);
                  }}
                  onViewCredits={(c) => {
                    setSelectedCustomerCredits(c);
                    setModalCreditsOpen(true);
                  }}
                  onDelete={handleDeleteCustomer}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Modales */}
      {modalOpen && (
        <ModalCustomer
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          customer={selectedCustomer}
        />
      )}
      {modalSalesOpen && selectedCustomerSales && (
        <ModalCustomerSales
          isOpen={modalSalesOpen}
          onClose={() => setModalSalesOpen(false)}
          customer={selectedCustomerSales}
        />
      )}
      {modalCreditsOpen && selectedCustomerCredits && (
        <ModalCustomerCredits
          isOpen={modalCreditsOpen}
          onClose={() => setModalCreditsOpen(false)}
          customer={selectedCustomerCredits}
        />
      )}
      {confirmOpen && (
        <ModalConfirm
          message="¿Seguro que deseas eliminar este cliente?"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

// ========== MODAL DE CONFIRMACIÓN ==========

function ModalConfirm({ message, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full border border-[#E2E8F0]"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <AlertCircle className="text-red-500" size={40} />
          <h2 className="text-lg font-semibold text-[#1E293B]">{message}</h2>
          <div className="flex gap-3 mt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-lg border border-[#E2E8F0] text-[#1E293B] hover:bg-[#F1F5F9] font-medium transition"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition"
            >
              Eliminar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
