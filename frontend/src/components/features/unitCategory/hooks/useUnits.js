import { useEffect, useState, useCallback } from "react";
import { getUnits, createUnit, putUnit, deleteUnit } from "@/api";

export default function useUnits() {
  const [units, setUnits] = useState([]);
  const [form, setForm] = useState({ name: "", abbreviation: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, unit: null });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 6,
    totalItems: 0,
    totalPages: 1,
  });

  // --- Fetch inicial ---
  const fetchUnits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUnits();
      setUnits(res || []);
    } catch {
      showToast("Error al cargar unidades de medida", "error");
      setUnits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  // --- Toast ---
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // --- Filtrar / Ordenar ---
  const filteredAndSortedUnits = units
    .filter((u) =>
      [u.name, u.abbreviation].join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const compareValue = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? compareValue : -compareValue;
    });

  // --- Reiniciar página cuando cambian filtros ---
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [searchTerm, sortOrder]);

  // --- Form ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = useCallback(() => {
    setForm({ name: "", abbreviation: "" });
    setEditingId(null);
  }, []);

  // --- Crear / Editar ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return showToast("El nombre es requerido", "error");
    if (!form.abbreviation.trim()) return showToast("La abreviatura es requerida", "error");

    try {
      if (editingId) {
        await putUnit(editingId, form);
        showToast("Unidad actualizada correctamente");
      } else {
        await createUnit(form);
        showToast("Unidad creada correctamente");
      }
      fetchUnits();
      handleCloseForm();
    } catch {
      showToast(editingId ? "Error al actualizar unidad" : "Error al crear unidad", "error");
    }
  };

  const handleOpenForm = (unit = null) => {
    if (unit) {
      setForm({ name: unit.name, abbreviation: unit.abbreviation });
      setEditingId(unit.id);
    } else {
      resetForm();
    }
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    resetForm();
    setShowFormModal(false);
  };

  // --- Confirmar eliminación ---
  const confirmDelete = (unit) => setConfirmModal({ show: true, unit });

  const handleDelete = async () => {
    try {
      if (confirmModal.unit) {
        await deleteUnit(confirmModal.unit.id);
        showToast("Unidad eliminada correctamente");
        fetchUnits();
      }
    } catch {
      showToast("Error al eliminar unidad. Puede estar en uso.", "error");
    } finally {
      setConfirmModal({ show: false, unit: null });
    }
  };

  // --- Orden ---
  const toggleSortOrder = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  // --- Paginación ---
  useEffect(() => {
    const totalItems = filteredAndSortedUnits.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage) || 1;

    setPagination((prev) => ({
      ...prev,
      totalItems,
      totalPages,
      currentPage: Math.min(prev.currentPage, totalPages),
    }));
  }, [filteredAndSortedUnits.length, pagination.itemsPerPage]);

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const changeItemsPerPage = (num) =>
    setPagination((prev) => ({ ...prev, itemsPerPage: num, currentPage: 1 }));

  const getPageNumbers = useCallback(() => {
    const { currentPage, totalPages } = pagination;

    if (totalPages <= 1) return [];

    const delta = 2;
    const pages = [];

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    if (pages[0] > 1) {
      if (pages[0] > 2) pages.unshift("...");
      pages.unshift(1);
    }

    if (pages[pages.length - 1] < totalPages) {
      if (pages[pages.length - 1] < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [pagination.currentPage, pagination.totalPages]);

  // --- Items actuales ---
  const indexOfLast = pagination.currentPage * pagination.itemsPerPage;
  const indexOfFirst = indexOfLast - pagination.itemsPerPage;
  const currentItems = filteredAndSortedUnits.slice(indexOfFirst, indexOfLast);

  // --- Stats ---
  const stats = {
    total: units.length,
    recentlyAdded: units.slice(-5).length,
  };

  return {
    units,
    form,
    editingId,
    searchTerm,
    loading,
    sortOrder,
    toast,
    confirmModal,
    showFormModal,
    pagination,
    filteredAndSortedUnits,
    currentItems,
    stats,

    setSearchTerm,
    setSortOrder,
    setForm,
    setShowFormModal,
    setConfirmModal,

    handleChange,
    handleSubmit,
    handleOpenForm,
    handleCloseForm,
    handleDelete,
    confirmDelete,
    toggleSortOrder,

    goToPage,
    changeItemsPerPage,
    getPageNumbers,
  };
}
