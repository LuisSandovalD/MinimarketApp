import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSupplier, deleteSupplier } from "../../../api/supplier";
import NavBar from "../../../components/navbars/NavBarAdmin";
import ModalSupplier from "../../../components/modals/ModalSupplier";
import Loading from "../../../components/common/Loading";
import {
  Search,
  Plus,
  Edit,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Building2,
  FileText,
  AlertCircle,
  Trash2,
} from "lucide-react";

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

const SupplierCard = ({ supplier, index, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-lg hover:border-[#CBD5E1] transition-all duration-300"
    >
      {/* Header */}
      <div className="bg-[#F8FAFC] p-6 border-b border-[#E2E8F0]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white border-2 border-[#E2E8F0] rounded-xl flex items-center justify-center text-[#1E293B] font-bold text-lg shadow-sm">
              {supplier.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1E293B]">{supplier.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <FileText size={14} className="text-[#94A3B8]" />
                <p className="text-sm text-[#64748B] font-medium">
                  RUC: {supplier.ruc || "Sin RUC"}
                </p>
              </div>
            </div>
          </div>
          {supplier.active ? (
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
        {supplier.phone && (
          <a
            href={`tel:+51${supplier.phone}`}
            className="flex items-center gap-3 text-[#64748B] hover:text-[#1E293B] transition-colors group"
          >
            <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] group-hover:bg-white transition-colors">
              <Phone size={16} className="text-[#94A3B8]" />
            </div>
            <span className="text-sm font-medium">{supplier.phone}</span>
          </a>
        )}

        {supplier.email && (
          <a
            href={`mailto:${supplier.email}`}
            className="flex items-center gap-3 text-[#64748B] hover:text-[#1E293B] transition-colors group"
          >
            <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] group-hover:bg-white transition-colors">
              <Mail size={16} className="text-[#94A3B8]" />
            </div>
            <span className="text-sm font-medium truncate">{supplier.email}</span>
          </a>
        )}

        {supplier.address && (
          <div className="flex items-center gap-3 text-[#64748B]">
            <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <MapPin size={16} className="text-[#94A3B8]" />
            </div>
            <span className="text-sm font-medium truncate">{supplier.address}</span>
          </div>
        )}

        {!supplier.phone && !supplier.email && !supplier.address && (
          <p className="text-sm text-[#94A3B8] italic">Sin información de contacto</p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-2 p-4 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <button
          onClick={() => onEdit(supplier)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-lg font-semibold text-sm transition-all"
        >
          <Edit size={16} />
          Editar
        </button>
        <button
          onClick={() => onDelete(supplier)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 hover:bg-red-200 text-[#B91C1C] rounded-lg font-semibold text-sm transition-all border border-red-200"
        >
          <Trash2 size={16} />
          Eliminar
        </button>
      </div>
    </motion.div>
  );
};

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#E2E8F0]"
  >
    <div className="w-20 h-20 bg-[#F8FAFC] rounded-2xl flex items-center justify-center mb-6 border border-[#E2E8F0]">
      <Building2 size={40} className="text-[#94A3B8]" />
    </div>
    <h3 className="text-xl font-bold text-[#1E293B] mb-2">No hay proveedores registrados</h3>
    <p className="text-[#64748B] text-center max-w-md">
      Comienza agregando tu primer proveedor usando el botón "Nuevo Proveedor".
    </p>
  </motion.div>
);

export default function SuppliersList() {
  const [suppliers, setSuppliers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const data = await getSupplier();
      setSuppliers(data);
      setFiltered(data);
    } catch {
      setError("No se pudieron cargar los proveedores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filteredData = suppliers.filter(
      (s) =>
        s.name?.toLowerCase().includes(value) ||
        s.ruc?.toLowerCase().includes(value) ||
        s.email?.toLowerCase().includes(value)
    );
    setFiltered(filteredData);
  };

  const handleOpenModal = (supplier = null) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };

  const handleSaved = async () => {
    await fetchSuppliers();
    handleCloseModal();
  };

  const confirmDelete = (supplier) => {
    setSupplierToDelete(supplier);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      if (supplierToDelete) {
        await deleteSupplier(supplierToDelete.id);
        fetchSuppliers();
      }
    } catch {
      // sin logs ni alerts
    } finally {
      setShowDeleteModal(false);
      setSupplierToDelete(null);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 max-w-md shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-50 rounded-xl border border-red-100">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1E293B]">Error al cargar</h3>
              <p className="text-sm text-[#64748B]">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchSuppliers}
            className="w-full px-4 py-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-lg font-semibold transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const activeSuppliers = suppliers.filter((s) => s.active).length;
  const inactiveSuppliers = suppliers.length - activeSuppliers;

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen lg:p-0 pt-16">
      <NavBar />
      <div className="flex-1 lg:ml-72 pt-20 lg:pt-0 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E293B] mb-1">
                Gestión de Proveedores
              </h1>
              <p className="text-[#64748B]">Administra tu red de proveedores</p>
            </div>

            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-5 py-3 bg-[#CBD5E1] hover:bg-[#94A3B8] text-[#1E293B] rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
            >
              <Plus size={20} />
              Nuevo Proveedor
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard icon={Building2} label="Total Proveedores" value={suppliers.length} />
            <StatCard icon={CheckCircle} label="Proveedores Activos" value={activeSuppliers} />
            <StatCard icon={XCircle} label="Proveedores Inactivos" value={inactiveSuppliers} />
          </div>

          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, RUC o correo..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 border border-[#E2E8F0] rounded-xl bg-white text-[#1E293B] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#CBD5E1] focus:border-[#CBD5E1] outline-none transition-all"
            />
          </div>
        </div>

        {/* Lista de proveedores */}
        {filtered.length === 0 ? (
          search ? (
            <div className="text-center py-20">
              <p className="text-[#64748B] text-lg">
                No se encontraron proveedores con "{search}"
              </p>
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          <AnimatePresence>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((supplier, index) => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  index={index}
                  onEdit={handleOpenModal}
                  onDelete={confirmDelete}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Modal de creación/edición */}
      {isModalOpen && (
        <ModalSupplier
          supplier={selectedSupplier}
          onClose={handleCloseModal}
          onSaved={handleSaved}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-[#DC2626]" size={28} />
                <h3 className="text-xl font-semibold text-[#1E293B]">
                  Confirmar eliminación
                </h3>
              </div>
              <p className="text-[#475569] mb-6">
                ¿Seguro que deseas eliminar al proveedor{" "}
                <span className="font-medium text-[#1E293B]">
                  {supplierToDelete?.name}
                </span>
                ? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-[#334155] hover:bg-[#F1F5F9] transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-all"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
