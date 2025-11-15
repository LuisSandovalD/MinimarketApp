import { useEffect, useState } from "react";
import { getCustomerRegister, deleteCustomer, getCredits } from "@/api";

export default function useCustomersManager() {
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

  // Créditos
  const [allCredits, setAllCredits] = useState([]);
  const [customersWithCredits, setCustomersWithCredits] = useState([]);
  const [overdueAlerts, setOverdueAlerts] = useState([]);

  // Filtros
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
                severity:
                  daysUntilDue < 0
                    ? "critical"
                    : daysUntilDue <= 3
                    ? "high"
                    : "medium",
              });
            }
          }
        }
      });

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

  useEffect(() => {
    let result = [...customers];
    const query = search.toLowerCase();

    if (query) {
      result = result.filter(
        c =>
          c.name?.toLowerCase().includes(query) ||
          c.dni_ruc?.toLowerCase().includes(query) ||
          c.email?.toLowerCase().includes(query) ||
          c.phone?.toLowerCase().includes(query) ||
          c.address?.toLowerCase().includes(query)
      );
    }

    if (filterStatus !== "all") {
      result = result.filter(c =>
        filterStatus === "active" ? c.active : !c.active
      );
    }

    if (filterHasEmail !== "all") {
      result = result.filter(c =>
        filterHasEmail === "yes"
          ? c.email?.trim() !== ""
          : !c.email || c.email.trim() === ""
      );
    }

    if (filterHasPhone !== "all") {
      result = result.filter(c =>
        filterHasPhone === "yes"
          ? c.phone?.trim() !== ""
          : !c.phone || c.phone.trim() === ""
      );
    }

    if (filterHasCredits !== "all") {
      const customerIdsWithPending = customersWithCredits
        .filter(cwc => cwc.pendingCredits.length > 0)
        .map(cwc => cwc.customerId);

      result =
        filterHasCredits === "yes"
          ? result.filter(c => customerIdsWithPending.includes(c.id))
          : result.filter(c => !customerIdsWithPending.includes(c.id));
    }

    result.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "dni":
          aVal = a.dni_ruc || "";
          bVal = b.dni_ruc || "";
          break;
        case "email":
          aVal = a.email || "";
          bVal = b.email || "";
          break;
        case "phone":
          aVal = a.phone || "";
          bVal = b.phone || "";
          break;
        case "credits":
          const ac = customersWithCredits.find(x => x.customerId === a.id);
          const bc = customersWithCredits.find(x => x.customerId === b.id);
          aVal = ac?.totalWithInterest || 0;
          bVal = bc?.totalWithInterest || 0;
          break;
        default:
          aVal = a.name?.toLowerCase() || "";
          bVal = b.name?.toLowerCase() || "";
          break;
      }

      return sortOrder === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
        ? 1
        : -1;
    });

    setFiltered(result);

    setPagination(prev => ({
      ...prev,
      totalItems: result.length,
      totalPages: Math.ceil(result.length / prev.itemsPerPage),
      currentPage: 1,
    }));
  }, [
    search,
    customers,
    filterStatus,
    filterHasEmail,
    filterHasPhone,
    filterHasCredits,
    sortBy,
    sortOrder,
    customersWithCredits,
  ]);

  const toggleSortOrder = () =>
    setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));

  const goToPage = page =>
    setPagination(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.totalPages)),
    }));

  const changeItemsPerPage = newLimit =>
    setPagination(prev => ({
      ...prev,
      itemsPerPage: newLimit,
      totalPages: Math.ceil(prev.totalItems / newLimit),
      currentPage: 1,
    }));

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

  const handleDeleteCustomer = id => {
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

  const getCustomerCredits = id =>
    customersWithCredits.find(cwc => cwc.customerId === id);

  const handleAlertClick = alert => {
    setSelectedCustomerCredits(alert.customer);
    setModalCreditsOpen(true);
    setShowAlertsPanel(false);
  };

  const activeCustomers = customers.filter(c => c.active).length;
  const inactiveCustomers = customers.length - activeCustomers;
  const customersWithEmail = customers.filter(
    c => c.email?.trim() !== ""
  ).length;
  const customersWithPendingCredits = customersWithCredits.filter(
    x => x.pendingCredits.length > 0
  ).length;

  return {
    customers,
    filtered,
    search,
    setSearch,
    loading,
    error,

    modalOpen,
    setModalOpen,
    selectedCustomer,
    setSelectedCustomer,

    modalSalesOpen,
    setModalSalesOpen,
    selectedCustomerSales,
    setSelectedCustomerSales,

    modalCreditsOpen,
    setModalCreditsOpen,
    selectedCustomerCredits,
    setSelectedCustomerCredits,

    showExportMenu,
    setShowExportMenu,
    showFilters,
    setShowFilters,
    showAlertsPanel,
    setShowAlertsPanel,

    confirmOpen,
    setConfirmOpen,
    handleDeleteCustomer,
    confirmDelete,

    allCredits,
    customersWithCredits,
    overdueAlerts,
    getCustomerCredits,
    handleAlertClick,

    filterStatus,
    setFilterStatus,
    filterHasEmail,
    setFilterHasEmail,
    filterHasPhone,
    setFilterHasPhone,
    filterHasCredits,
    setFilterHasCredits,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    clearFilters,
    activeFiltersCount,

    pagination,
    goToPage,
    changeItemsPerPage,
    getPageNumbers,
    currentCustomers,

    activeCustomers,
    inactiveCustomers,
    customersWithEmail,
    customersWithPendingCredits,
    setCustomerToDelete,
    customerToDelete
  };
}
