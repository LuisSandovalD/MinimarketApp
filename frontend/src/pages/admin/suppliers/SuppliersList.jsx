import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSupplier, deleteSupplier } from "@/api";
import NavBar from "../../../components/navbars/NavBarAdmin";
import ModalSupplier from "../../../components/modalsForms/SupplierFormModal";
import Loading from "@/components/common/loaders/AppLoading";
import Pagination from "@/components/common/Pagination";
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
  Filter,
  SortAsc,
  SortDesc,
  Download,
  X,
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
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filtros y ordenamiento
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterHasEmail, setFilterHasEmail] = useState("all");
  const [filterHasPhone, setFilterHasPhone] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Paginación
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
  });

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

  // Aplicar filtros, búsqueda y ordenamiento
  useEffect(() => {
    let result = [...suppliers];
    const query = search.toLowerCase();

    // Búsqueda
    if (query) {
      result = result.filter(
        (s) =>
          s.name?.toLowerCase().includes(query) ||
          s.ruc?.toLowerCase().includes(query) ||
          s.email?.toLowerCase().includes(query) ||
          s.phone?.toLowerCase().includes(query) ||
          s.address?.toLowerCase().includes(query)
      );
    }

    // Filtro por estado
    if (filterStatus !== "all") {
      result = result.filter((s) =>
        filterStatus === "active" ? s.active : !s.active
      );
    }

    // Filtro por email
    if (filterHasEmail !== "all") {
      result = result.filter((s) =>
        filterHasEmail === "yes" ? s.email && s.email.trim() !== "" : !s.email || s.email.trim() === ""
      );
    }

    // Filtro por teléfono
    if (filterHasPhone !== "all") {
      result = result.filter((s) =>
        filterHasPhone === "yes" ? s.phone && s.phone.trim() !== "" : !s.phone || s.phone.trim() === ""
      );
    }

    // Ordenamiento
    result.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "ruc":
          aValue = a.ruc || "";
          bValue = b.ruc || "";
          break;
        case "email":
          aValue = a.email || "";
          bValue = b.email || "";
          break;
        case "phone":
          aValue = a.phone || "";
          bValue = b.phone || "";
          break;
        default:
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
      }

      return sortOrder === "asc"
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });

    setFiltered(result);
    setPagination((prev) => ({
      ...prev,
      totalItems: result.length,
      totalPages: Math.ceil(result.length / prev.itemsPerPage),
      currentPage: 1,
    }));
  }, [search, suppliers, filterStatus, filterHasEmail, filterHasPhone, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const goToPage = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.totalPages)),
    }));
  };

  const changeItemsPerPage = (newLimit) => {
    setPagination((prev) => ({
      ...prev,
      itemsPerPage: newLimit,
      totalPages: Math.ceil(prev.totalItems / newLimit),
      currentPage: 1,
    }));
  };

  const getPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      if (start > 1) pages.push(1, "...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages) pages.push("...", totalPages);
    }
    return pages;
  };

  const indexOfLast = pagination.currentPage * pagination.itemsPerPage;
  const indexOfFirst = indexOfLast - pagination.itemsPerPage;
  const currentSuppliers = filtered.slice(indexOfFirst, indexOfLast);

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

  const exportToExcel = () => {
    const headers = ["Nombre", "RUC", "Teléfono", "Email", "Dirección", "Estado"];
    let csvContent = headers.join(",") + "\n";

    filtered.forEach((item) => {
      const row = [
        `"${item.name || ""}"`,
        item.ruc || "",
        item.phone || "",
        item.email || "",
        `"${item.address || ""}"`,
        item.active ? "Activo" : "Inactivo",
      ];
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `proveedores_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    setShowExportMenu(false);
  };

  const exportToPDF = () => {
    const printWindow = window.open("", "_blank");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lista de Proveedores</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { color: #0f172a; text-align: center; margin-bottom: 10px; }
          .date { text-align: center; color: #64748b; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f8fafc; color: #1e293b; padding: 12px; text-align: left; border: 1px solid #e2e8f0; font-size: 12px; }
          td { padding: 10px; border: 1px solid #e2e8f0; font-size: 11px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .status-active { color: #16a34a; font-weight: bold; }
          .status-inactive { color: #dc2626; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>Lista de Proveedores</h2>
        <p class="date">Fecha: ${new Date().toLocaleDateString('es-PE')}</p>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>RUC</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(item => `
              <tr>
                <td>${item.name || "—"}</td>
                <td>${item.ruc || "—"}</td>
                <td>${item.phone || "—"}</td>
                <td>${item.email || "—"}</td>
                <td>${item.address || "—"}</td>
                <td class="${item.active ? 'status-active' : 'status-inactive'}">${item.active ? 'Activo' : 'Inactivo'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 250);

    setShowExportMenu(false);
  };

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterHasEmail("all");
    setFilterHasPhone("all");
    setSortBy("name");
    setSortOrder("asc");
    setSearch("");
  };

  const activeFiltersCount = [
    filterStatus !== "all",
    filterHasEmail !== "all",
    filterHasPhone !== "all",
  ].filter(Boolean).length;

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
  const suppliersWithEmail = suppliers.filter((s) => s.email && s.email.trim() !== "").length;

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

            <div className="flex gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  <Download size={20} />
                  Exportar
                </button>

                <AnimatePresence>
                  {showExportMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-[#E2E8F0] shadow-lg z-10 overflow-hidden"
                    >
                      <button
                        onClick={exportToExcel}
                        className="w-full px-4 py-3 text-left hover:bg-[#F8FAFC] transition-colors flex items-center gap-3 text-[#1E293B]"
                      >
                        <FileText size={18} className="text-[#64748B]" />
                        <span className="font-medium">Exportar a CSV</span>
                      </button>
                      <button
                        onClick={exportToPDF}
                        className="w-full px-4 py-3 text-left hover:bg-[#F8FAFC] transition-colors flex items-center gap-3 text-[#1E293B]"
                      >
                        <FileText size={18} className="text-[#64748B]" />
                        <span className="font-medium">Exportar a PDF</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-5 py-3 bg-[#CBD5E1] hover:bg-[#94A3B8] text-[#1E293B] rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
              >
                <Plus size={20} />
                Nuevo Proveedor
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Building2} label="Total Proveedores" value={suppliers.length} />
            <StatCard icon={CheckCircle} label="Activos" value={activeSuppliers} />
            <StatCard icon={XCircle} label="Inactivos" value={inactiveSuppliers} />
            <StatCard icon={Mail} label="Con Email" value={suppliersWithEmail} />
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, RUC, email, teléfono o dirección..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-[#E2E8F0] rounded-xl bg-white text-[#1E293B] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#CBD5E1] focus:border-[#CBD5E1] outline-none transition-all"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                  showFilters || activeFiltersCount > 0
                    ? "bg-[#CBD5E1] text-[#1E293B]"
                    : "bg-white border border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8FAFC]"
                }`}
              >
                <Filter size={20} />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-[#1E293B] text-white text-xs rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <button
                onClick={toggleSortOrder}
                className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] rounded-xl font-semibold transition-all"
              >
                {sortOrder === "asc" ? <SortAsc size={20} /> : <SortDesc size={20} />}
                Orden
              </button>
            </div>

            {/* Panel de filtros avanzados */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#1E293B]">Filtros Avanzados</h3>
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 text-[#64748B] hover:text-[#1E293B] transition-colors"
                    >
                      <X size={18} />
                      <span className="text-sm font-medium">Limpiar filtros</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#64748B] mb-2">
                        Estado
                      </label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:ring-2 focus:ring-[#CBD5E1] outline-none"
                      >
                        <option value="all">Todos</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#64748B] mb-2">
                        Email
                      </label>
                      <select
                        value={filterHasEmail}
                        onChange={(e) => setFilterHasEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:ring-2 focus:ring-[#CBD5E1] outline-none"
                      >
                        <option value="all">Todos</option>
                        <option value="yes">Con email</option>
                        <option value="no">Sin email</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#64748B] mb-2">
                        Teléfono
                      </label>
                      <select
                        value={filterHasPhone}
                        onChange={(e) => setFilterHasPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:ring-2 focus:ring-[#CBD5E1] outline-none"
                      >
                        <option value="all">Todos</option>
                        <option value="yes">Con teléfono</option>
                        <option value="no">Sin teléfono</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#64748B] mb-2">
                        Ordenar por
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:ring-2 focus:ring-[#CBD5E1] outline-none"
                      >
                        <option value="name">Nombre</option>
                        <option value="ruc">RUC</option>
                        <option value="email">Email</option>
                        <option value="phone">Teléfono</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tabla de proveedores */}
        {filtered.length === 0 ? (
          search || activeFiltersCount > 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-lg">
                No se encontraron proveedores con los filtros aplicados
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-[#CBD5E1] hover:bg-[#94A3B8] text-[#1E293B] rounded-lg font-semibold transition-all"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          <>
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
                    {currentSuppliers.map((supplier, index) => (
                      <motion.tr
                        key={supplier.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-center text-[#1E293B] font-bold">
                              {supplier.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <span className="font-semibold text-[#1E293B]">
                              {supplier.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[#64748B] font-medium">
                            {supplier.ruc || "—"}
                          </span>
                        </td>
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
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenModal(supplier)}
                              className="p-2 hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] rounded-lg transition-all"
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => confirmDelete(supplier)}
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

            {/* Paginación */}
            <Pagination
                pagination={pagination}
                goToPage={goToPage}
                changeItemsPerPage={changeItemsPerPage}
                getPageNumbers={getPageNumbers}
              />
          </>
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