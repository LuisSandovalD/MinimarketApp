import { useState, useEffect, useCallback } from "react";
import { getUserRegister, deleteUser } from "@/api";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Filtros
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);

  // Paginación
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserRegister();
      setUsers(data || []);
      setFiltered(data || []);
    } catch (error) {
      showToast("Error al cargar usuarios", "error");
      setUsers([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      await loadUsers();
      showToast("Usuario eliminado correctamente", "success");
    } catch (error) {
      showToast("No se pudo eliminar el usuario. Puede estar en uso.", "error");
    }
  };

  // Obtener roles únicos
  const uniqueRoles = [...new Set(users.map(u => u.roles?.[0]?.name).filter(Boolean))];

  // Aplicar filtros, búsqueda y ordenamiento
  useEffect(() => {
    let result = [...users];
    const query = search.toLowerCase();

    // Búsqueda
    if (query) {
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.roles?.[0]?.name?.toLowerCase().includes(query)
      );
    }

    // Filtro por rol
    if (roleFilter !== "all") {
      result = result.filter(
        (user) => user.roles?.[0]?.name?.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    // Ordenamiento
    result.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "email":
          aValue = a.email || "";
          bValue = b.email || "";
          break;
        case "role":
          aValue = a.roles?.[0]?.name || "";
          bValue = b.roles?.[0]?.name || "";
          break;
        case "date":
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
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
  }, [search, users, roleFilter, sortBy, sortOrder]);

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

  const clearFilters = () => {
    setRoleFilter("all");
    setSortBy("name");
    setSortOrder("asc");
    setSearch("");
  };

  const activeFiltersCount = [roleFilter !== "all"].filter(Boolean).length;

  // Estadísticas
  const stats = {
    total: users.length,
    byRole: uniqueRoles.reduce((acc, role) => {
      acc[role] = users.filter(u => u.roles?.[0]?.name === role).length;
      return acc;
    }, {}),
  };

  // Usuarios paginados
  const indexOfLast = pagination.currentPage * pagination.itemsPerPage;
  const indexOfFirst = indexOfLast - pagination.itemsPerPage;
  const currentUsers = filtered.slice(indexOfFirst, indexOfLast);

  return {
    users,
    filtered,
    currentUsers,
    loading,
    error,
    toast,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    showFilters,
    setShowFilters,
    pagination,
    goToPage,
    changeItemsPerPage,
    getPageNumbers,
    uniqueRoles,
    activeFiltersCount,
    clearFilters,
    stats,
    indexOfFirst,
    loadUsers,
    handleDeleteUser,
    showToast,
  };
}