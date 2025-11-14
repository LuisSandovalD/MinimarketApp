import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import { getCustomerRegister, deleteCustomer, getCredits } from "@/api";
import ModalCustomer from "../../../components/modalsForms/CustomerFormModal";
import ModalCustomerSales from "../../../components/modalsForms/SalesFormModal";
import ModalCustomerCredits from "../../../components/modalsForms/CreditsFormModal";
import Loading from "@/components/common/loaders/AppLoading";
import Pagination from "@/components/common/Pagination";
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
  Filter,
  SortAsc,
  SortDesc,
  Download,
  FileText,
  X,
  Bell,
  Clock,
  AlertTriangle,
} from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center gap-4">
      <div className={`p-3 ${color} rounded-xl`}>
        <Icon className="text-white" size={22} />
      </div>
      <div>
        <p className="text-sm text-gray-600 font-semibold mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

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

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAlertsPanel, setShowAlertsPanel] = useState(false);

  // Estados para créditos
  const [allCredits, setAllCredits] = useState([]);
  const [customersWithCredits, setCustomersWithCredits] = useState([]);
  const [overdueAlerts, setOverdueAlerts] = useState([]);

  // Filtros y ordenamiento
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterHasEmail, setFilterHasEmail] = useState("all");
  const [filterHasPhone, setFilterHasPhone] = useState("all");
  const [filterHasCredits, setFilterHasCredits] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Paginación
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const loadCustomers = async () => {
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

  const loadCredits = async () => {
    try {
      const data = await getCredits();
      setAllCredits(data);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Agrupar créditos por cliente
      const customerCreditsMap = {};
      const alerts = [];
      
      data.forEach(credit => {
        const customerId = credit.sale?.customer?.id;
        if (customerId) {
          if (!customerCreditsMap[customerId]) {
            customerCreditsMap[customerId] = {
              customerId,
              customerName: credit.sale?.customer?.name,
              credits: [],
              pendingCredits: [],
              totalPending: 0,
              totalInterest: 0,
              totalWithInterest: 0,
            };
          }
          
          customerCreditsMap[customerId].credits.push(credit);
          
          if (credit.status === "pendiente") {
            const dueDate = new Date(credit.due_date);
            dueDate.setHours(0, 0, 0, 0);
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            
            customerCreditsMap[customerId].pendingCredits.push(credit);
            customerCreditsMap[customerId].totalPending += parseFloat(credit.total_amount || 0);
            customerCreditsMap[customerId].totalInterest += parseFloat(credit.interest_amount || 0);
            customerCreditsMap[customerId].totalWithInterest += parseFloat(credit.total_with_interest || 0);
            
            // Generar alertas para créditos vencidos o por vencer (7 días o menos)
            if (daysUntilDue <= 7) {
              alerts.push({
                creditId: credit.id,
                customerId,
                customerName: credit.sale?.customer?.name,
                customer: credit.sale?.customer,
                saleId: credit.sale_id,
                amount: parseFloat(credit.total_with_interest || 0),
                dueDate: credit.due_date,
                daysUntilDue,
                isOverdue: daysUntilDue < 0,
                severity: daysUntilDue < 0 ? 'critical' : daysUntilDue <= 3 ? 'high' : 'medium'
              });
            }
          }
        }
      });
      
      // Ordenar alertas por severidad y días hasta vencimiento
      alerts.sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        return a.daysUntilDue - b.daysUntilDue;
      });
      
      setCustomersWithCredits(Object.values(customerCreditsMap));
      setOverdueAlerts(alerts);
    } catch (err) {
      console.error("Error al cargar créditos:", err);
    }
  };

  useEffect(() => {
    loadCustomers();
    loadCredits();
  }, []);

  // Aplicar filtros, búsqueda y ordenamiento
  useEffect(() => {
    let result = [...customers];
    const query = search.toLowerCase();

    // Búsqueda
    if (query) {
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(query) ||
          c.dni_ruc?.toLowerCase().includes(query) ||
          c.email?.toLowerCase().includes(query) ||
          c.phone?.toLowerCase().includes(query) ||
          c.address?.toLowerCase().includes(query)
      );
    }

    // Filtro por estado
    if (filterStatus !== "all") {
      result = result.filter((c) =>
        filterStatus === "active" ? c.active : !c.active
      );
    }

    // Filtro por email
    if (filterHasEmail !== "all") {
      result = result.filter((c) =>
        filterHasEmail === "yes" ? c.email && c.email.trim() !== "" : !c.email || c.email.trim() === ""
      );
    }

    // Filtro por teléfono
    if (filterHasPhone !== "all") {
      result = result.filter((c) =>
        filterHasPhone === "yes" ? c.phone && c.phone.trim() !== "" : !c.phone || c.phone.trim() === ""
      );
    }

    // Filtro por créditos pendientes
    if (filterHasCredits !== "all") {
      const customerIdsWithPendingCredits = customersWithCredits
        .filter(cwc => cwc.pendingCredits.length > 0)
        .map(cwc => cwc.customerId);
      
      if (filterHasCredits === "yes") {
        result = result.filter(c => customerIdsWithPendingCredits.includes(c.id));
      } else {
        result = result.filter(c => !customerIdsWithPendingCredits.includes(c.id));
      }
    }

    // Ordenamiento
    result.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "dni":
          aValue = a.dni_ruc || "";
          bValue = b.dni_ruc || "";
          break;
        case "email":
          aValue = a.email || "";
          bValue = b.email || "";
          break;
        case "phone":
          aValue = a.phone || "";
          bValue = b.phone || "";
          break;
        case "credits":
          const aCredits = customersWithCredits.find(cwc => cwc.customerId === a.id);
          const bCredits = customersWithCredits.find(cwc => cwc.customerId === b.id);
          aValue = aCredits?.totalWithInterest || 0;
          bValue = bCredits?.totalWithInterest || 0;
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
  }, [search, customers, filterStatus, filterHasEmail, filterHasPhone, filterHasCredits, sortBy, sortOrder, customersWithCredits]);

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
  const currentCustomers = filtered.slice(indexOfFirst, indexOfLast);

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

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterHasEmail("all");
    setFilterHasPhone("all");
    setFilterHasCredits("all");
    setSortBy("name");
    setSortOrder("asc");
    setSearch("");
  };

  const activeFiltersCount = [
    filterStatus !== "all",
    filterHasEmail !== "all",
    filterHasPhone !== "all",
    filterHasCredits !== "all",
  ].filter(Boolean).length;

  const getCustomerCredits = (customerId) => {
    return customersWithCredits.find(cwc => cwc.customerId === customerId);
  };

  const handleAlertClick = (alert) => {
    setSelectedCustomerCredits(alert.customer);
    setModalCreditsOpen(true);
    setShowAlertsPanel(false);
  };

  const exportToExcel = () => {
    const headers = ["Nombre", "DNI/RUC", "Teléfono", "Email", "Dirección", "Estado", "Créditos Pendientes", "Total a Pagar"];
    let csvContent = headers.join(",") + "\n";

    filtered.forEach((customer) => {
      const customerCredit = getCustomerCredits(customer.id);
      const row = [
        `"${customer.name || ""}"`,
        customer.dni_ruc || "",
        customer.phone || "",
        customer.email || "",
        `"${customer.address || ""}"`,
        customer.active ? "Activo" : "Inactivo",
        customerCredit?.pendingCredits.length || 0,
        `S/ ${customerCredit?.totalWithInterest.toFixed(2) || "0.00"}`,
      ];
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `clientes_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    setShowExportMenu(false);
  };

  const exportToPDF = () => {
    const printWindow = window.open("", "_blank");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lista de Clientes</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { color: #1e293b; text-align: center; margin-bottom: 10px; }
          .date { text-align: center; color: #64748b; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f1f5f9; color: #1e293b; padding: 12px; text-align: left; border: 1px solid #e2e8f0; font-size: 11px; }
          td { padding: 10px; border: 1px solid #e2e8f0; font-size: 10px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .status-active { color: #16a34a; font-weight: bold; }
          .status-inactive { color: #dc2626; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>Lista de Clientes</h2>
        <p class="date">Fecha: ${new Date().toLocaleDateString('es-PE')}</p>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>DNI/RUC</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Créditos</th>
              <th>Total Pendiente</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(customer => {
              const customerCredit = getCustomerCredits(customer.id);
              return `
              <tr>
                <td>${customer.name || "—"}</td>
                <td>${customer.dni_ruc || "—"}</td>
                <td>${customer.phone || "—"}</td>
                <td>${customer.email || "—"}</td>
                <td class="${customer.active ? 'status-active' : 'status-inactive'}">${customer.active ? 'Activo' : 'Inactivo'}</td>
                <td>${customerCredit?.pendingCredits.length || 0}</td>
                <td>S/ ${customerCredit?.totalWithInterest.toFixed(2) || "0.00"}</td>
              </tr>
            `}).join('')}
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

  if (loading) return <Loading />;

  const activeCustomers = customers.filter((c) => c.active).length;
  const inactiveCustomers = customers.length - activeCustomers;
  const customersWithEmail = customers.filter((c) => c.email && c.email.trim() !== "").length;
  const customersWithPendingCredits = customersWithCredits.filter(cwc => cwc.pendingCredits.length > 0).length;

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:p-0">
      <NavBarAdmin />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-72">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Gestión de Clientes</h1>
              <p className="text-gray-600">Administra tu cartera de clientes</p>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowAlertsPanel(!showAlertsPanel)}
                  className="relative flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  <Bell size={20} />
                  Alertas
                  {overdueAlerts.length > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                      {overdueAlerts.length}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showAlertsPanel && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-96 bg-white rounded-xl border border-gray-200 shadow-xl z-50 max-h-[500px] overflow-hidden flex flex-col"
                    >
                      <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="text-red-500" size={20} />
                            <h3 className="font-bold text-gray-900">Alertas de Pagos</h3>
                          </div>
                          <button
                            onClick={() => setShowAlertsPanel(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {overdueAlerts.length} crédito{overdueAlerts.length !== 1 ? 's' : ''} requiere{overdueAlerts.length === 1 ? '' : 'n'} atención
                        </p>
                      </div>
                      
                      <div className="overflow-y-auto flex-1">
                        {overdueAlerts.length === 0 ? (
                          <div className="p-8 text-center">
                            <CheckCircle className="mx-auto text-green-500 mb-3" size={48} />
                            <p className="text-gray-600 font-medium">No hay alertas pendientes</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Todos los pagos están al día
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {overdueAlerts.map((alert, index) => (
                              <motion.button
                                key={`${alert.creditId}-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleAlertClick(alert)}
                                className={`w-full p-4 hover:bg-gray-50 transition-all text-left ${
                                  alert.severity === 'critical' 
                                    ? 'bg-red-50 hover:bg-red-100 border-l-4 border-red-500' 
                                    : alert.severity === 'high'
                                    ? 'bg-orange-50 hover:bg-orange-100 border-l-4 border-orange-500'
                                    : 'bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-500'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      {alert.isOverdue ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                          <AlertCircle size={12} />
                                          VENCIDO
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                                          <Clock size={12} />
                                          POR VENCER
                                        </span>
                                      )}
                                    </div>
                                    <p className="font-semibold text-gray-900 truncate">
                                      {alert.customerName}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Venta #{alert.saleId}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-xs text-gray-500">
                                        {alert.isOverdue 
                                          ? `Vencido hace ${Math.abs(alert.daysUntilDue)} día${Math.abs(alert.daysUntilDue) !== 1 ? 's' : ''}`
                                          : `Vence en ${alert.daysUntilDue} día${alert.daysUntilDue !== 1 ? 's' : ''}`
                                        }
                                      </span>
                                      <span className="text-sm font-bold text-gray-900">
                                        S/ {alert.amount.toFixed(2)}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Vencimiento: {new Date(alert.dueDate).toLocaleDateString('es-PE')}
                                    </p>
                                  </div>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>

                      {overdueAlerts.length > 0 && (
                        <div className="p-3 border-t border-gray-200 bg-gray-50">
                          <div className="text-xs text-gray-600 text-center">
                            <span className="font-semibold">Total pendiente:</span>{' '}
                            <span className="font-bold text-red-600">
                              S/ {overdueAlerts.reduce((sum, a) => sum + a.amount, 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
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
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg z-10 overflow-hidden"
                    >
                      <button
                        onClick={exportToExcel}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-900"
                      >
                        <FileText size={18} className="text-gray-600" />
                        <span className="font-medium">Exportar a CSV</span>
                      </button>
                      <button
                        onClick={exportToPDF}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-900"
                      >
                        <FileText size={18} className="text-gray-600" />
                        <span className="font-medium">Exportar a PDF</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
              >
                <UserPlus size={20} />
                Nuevo Cliente
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Users} label="Total Clientes" value={customers.length} color="bg-blue-500" />
            <StatCard icon={CheckCircle} label="Activos" value={activeCustomers} color="bg-green-500" />
            <StatCard icon={CreditCard} label="Con Créditos" value={customersWithPendingCredits} color="bg-cyan-500" />
            <StatCard icon={Mail} label="Con Email" value={customersWithEmail} color="bg-purple-500" />
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, DNI/RUC, email, teléfono o dirección..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                  showFilters || activeFiltersCount > 0
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Filter size={20} />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-white text-blue-600 text-xs rounded-full font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <button
                onClick={toggleSortOrder}
                className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-xl font-semibold transition-all"
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
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Filtros Avanzados</h3>
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <X size={18} />
                      <span className="text-sm font-medium">Limpiar filtros</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        Estado
                      </label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                      >
                        <option value="all">Todos</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        Email
                      </label>
                      <select
                        value={filterHasEmail}
                        onChange={(e) => setFilterHasEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                      >
                        <option value="all">Todos</option>
                        <option value="yes">Con email</option>
                        <option value="no">Sin email</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        Teléfono
                      </label>
                      <select
                        value={filterHasPhone}
                        onChange={(e) => setFilterHasPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                      >
                        <option value="all">Todos</option>
                        <option value="yes">Con teléfono</option>
                        <option value="no">Sin teléfono</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        Créditos
                      </label>
                      <select
                        value={filterHasCredits}
                        onChange={(e) => setFilterHasCredits(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                      >
                        <option value="all">Todos</option>
                        <option value="yes">Con créditos pendientes</option>
                        <option value="no">Sin créditos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        Ordenar por
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                      >
                        <option value="name">Nombre</option>
                        <option value="dni">DNI/RUC</option>
                        <option value="email">Email</option>
                        <option value="phone">Teléfono</option>
                        <option value="credits">Monto de crédito</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tabla de clientes */}
        {filtered.length === 0 ? (
          search || activeFiltersCount > 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-600 text-lg">
                No se encontraron clientes con los filtros aplicados
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-200">
                <Users size={40} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No hay clientes registrados</h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                Comienza agregando tu primer cliente usando el botón "Nuevo Cliente".
              </p>
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
              >
                <UserPlus size={20} />
                Agregar Cliente
              </button>
            </motion.div>
          )
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        Cliente
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        DNI/RUC
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        Contacto
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        Dirección
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        Créditos
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCustomers.map((customer, index) => {
                      const customerCredit = getCustomerCredits(customer.id);
                      const hasPendingCredits = customerCredit && customerCredit.pendingCredits.length > 0;
                      
                      return (
                        <motion.tr
                          key={customer.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                                {customer.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <span className="font-semibold text-gray-900">
                                {customer.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-600 font-medium">
                              {customer.dni_ruc || "—"}
                            </span>
                          </td>
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
                                <span className="text-gray-400 text-sm italic">
                                  Sin contacto
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {customer.address ? (
                              <div className="flex items-start gap-2 text-gray-600">
                                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                                <span className="text-sm line-clamp-2">
                                  {customer.address}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm italic">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {hasPendingCredits ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <CreditCard size={14} className="text-cyan-600" />
                                  <span className="text-sm font-semibold text-gray-900">
                                    {customerCredit.pendingCredits.length} crédito{customerCredit.pendingCredits.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600">
                                  Total: <span className="font-bold text-cyan-600">S/ {customerCredit.totalWithInterest.toFixed(2)}</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm italic">Sin créditos</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {customer.active ? (
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

      {/* Modales */}
      {modalOpen && (
        <ModalCustomer
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          customer={selectedCustomer}
          onSuccess={loadCustomers}
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
          onClose={() => {
            setModalCreditsOpen(false);
            setSelectedCustomerCredits(null);
            // Recargar créditos cuando se cierra el modal
            loadCredits();
          }}
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full border border-gray-200"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center border border-red-200">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Confirmar eliminación</h2>
          <p className="text-gray-600">{message}</p>
          <div className="flex gap-3 mt-4 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 hover:bg-gray-50 font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold transition-all"
            >
              Eliminar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}