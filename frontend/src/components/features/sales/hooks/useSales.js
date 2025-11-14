import { useState, useEffect } from "react";
import { getSales, deleteSales, getUserRegister, getCustomerRegister, getPayment, getDocument } from "@/api";

export default function useSales() {
  const [sales, setSales] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    paymentMethod: "",
    saleType: "",
    customer: "",
  });

  // Estados para ordenamiento
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Paginación
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const fetchSales = async () => {
    try {
      const res = await getSales();
      const salesData = res?.data || res || [];
      setSales(salesData);
      setFiltered(salesData);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
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

  const handleDelete = async (saleId) => {
    try {
      await deleteSales(saleId);
      await fetchSales();
    } catch (error) {
      console.error("Error al eliminar venta:", error);
    }
  };

  const applyFilters = (
    searchValue = search,
    currentFilters = filters,
    currentSortBy = sortBy,
    currentSortOrder = sortOrder
  ) => {
    let filteredData = [...sales];

    // Búsqueda por texto
    if (searchValue) {
      filteredData = filteredData.filter(
        (s) =>
          s.sale_number?.toString().toLowerCase().includes(searchValue) ||
          s.customer?.name?.toLowerCase().includes(searchValue) ||
          s.user?.name?.toLowerCase().includes(searchValue)
      );
    }

    // Filtro por rango de fechas
    if (currentFilters.dateFrom) {
      filteredData = filteredData.filter(
        (s) => new Date(s.date) >= new Date(currentFilters.dateFrom)
      );
    }
    if (currentFilters.dateTo) {
      filteredData = filteredData.filter(
        (s) => new Date(s.date) <= new Date(currentFilters.dateTo)
      );
    }

    // Filtro por método de pago
    if (currentFilters.paymentMethod) {
      filteredData = filteredData.filter(
        (s) => s.payment_method_id === parseInt(currentFilters.paymentMethod)
      );
    }

    // Filtro por tipo de venta
    if (currentFilters.saleType === "credit") {
      filteredData = filteredData.filter((s) => s.credit);
    } else if (currentFilters.saleType === "cash") {
      filteredData = filteredData.filter((s) => !s.credit);
    }

    // Filtro por cliente
    if (currentFilters.customer) {
      filteredData = filteredData.filter(
        (s) => s.customer_id === parseInt(currentFilters.customer)
      );
    }

    // Ordenamiento
    filteredData.sort((a, b) => {
      let aValue, bValue;
      switch (currentSortBy) {
        case "total":
          aValue = Number(a.total) || 0;
          bValue = Number(b.total) || 0;
          break;
        case "customer":
          aValue = a.customer?.name?.toLowerCase() || "";
          bValue = b.customer?.name?.toLowerCase() || "";
          break;
        case "number":
          aValue = Number(a.sale_number) || 0;
          bValue = Number(b.sale_number) || 0;
          break;
        default: // date
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }

      return currentSortOrder === "asc"
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });

    setFiltered(filteredData);
    setPagination((prev) => ({
      ...prev,
      totalItems: filteredData.length,
      totalPages: Math.ceil(filteredData.length / prev.itemsPerPage),
      currentPage: 1,
    }));
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    applyFilters(value, filters, sortBy, sortOrder);
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    applyFilters(search, filters, sortBy, newOrder);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    applyFilters(search, filters, newSortBy, sortOrder);
  };

  const clearFilters = () => {
    const resetFilters = {
      dateFrom: "",
      dateTo: "",
      paymentMethod: "",
      saleType: "",
      customer: "",
    };
    setFilters(resetFilters);
    setSearch("");
    setSortBy("date");
    setSortOrder("desc");
    applyFilters("", resetFilters, "date", "desc");
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

  const activeFiltersCount = Object.values(filters).filter((v) => v !== "").length;

  const indexOfLast = pagination.currentPage * pagination.itemsPerPage;
  const indexOfFirst = indexOfLast - pagination.itemsPerPage;
  const currentSales = filtered.slice(indexOfFirst, indexOfLast);

  // Estadísticas
  const totalSales = filtered.reduce((sum, s) => sum + Number(s.total), 0);
  const creditSales = filtered.filter((s) => s.credit);
  const totalCredit = creditSales.reduce(
    (sum, s) => sum + Number(s.total) + Number(s.credit?.interest_amount || 0),
    0
  );
  const totalCash = totalSales - creditSales.reduce((sum, s) => sum + Number(s.total), 0);

  useEffect(() => {
    fetchSales();
    fetchRelatedData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return {
    sales,
    filtered,
    currentSales,
    search,
    handleSearch,
    users,
    paymentMethod,
    customers,
    documents,
    loading,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    sortBy,
    handleSortChange,
    sortOrder,
    toggleSortOrder,
    activeFiltersCount,
    clearFilters,
    pagination,
    goToPage,
    changeItemsPerPage,
    getPageNumbers,
    fetchSales,
    handleDelete,
    totalSales,
    creditSales,
    totalCredit,
    totalCash,
  };
}