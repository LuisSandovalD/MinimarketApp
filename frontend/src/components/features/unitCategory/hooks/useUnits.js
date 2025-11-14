import { useState, useEffect, useCallback } from "react";
import { getUnits, createUnit, putUnit, deleteUnit } from "@/api";

export default function useUnits() {
  const [units, setUnits] = useState([]);
  const [form, setForm] = useState({ name: "", abbreviation: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ show: false, unit: null });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 6,
    totalItems: 0,
    totalPages: 1,
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
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
  };

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const resetForm = useCallback(() => {
    setForm({ name: "", abbreviation: "" });
    setEditingId(null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return showToast("El nombre es requerido", "error");
    if (!form.abbreviation.trim())
      return showToast("La abreviatura es requerida", "error");

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
      showToast("Error al guardar unidad", "error");
    }
  };

  const handleOpenForm = (unit = null) => {
    if (unit) {
      setForm({ name: unit.name, abbreviation: unit.abbreviation });
      setEditingId(unit.id);
    } else resetForm();
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    resetForm();
    setShowFormModal(false);
  };

  const confirmDelete = (unit) => {
    setConfirmModal({ show: true, unit });
  };

  const handleDelete = async () => {
    try {
      await deleteUnit(confirmModal.unit.id);
      showToast("Unidad eliminada correctamente");
      fetchUnits();
    } catch {
      showToast("Error al eliminar unidad. Puede estar en uso.", "error");
    } finally {
      setConfirmModal({ show: false, unit: null });
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Filtrado y ordenamiento
  const filteredUnits = units
    .filter((u) =>
      [u.name, u.abbreviation].join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  // Actualizar paginación
  useEffect(() => {
    const totalItems = filteredUnits.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage) || 1;
    setPagination((prev) => ({
      ...prev,
      totalItems,
      totalPages,
      currentPage: Math.min(prev.currentPage, totalPages),
    }));
  }, [filteredUnits.length, pagination.itemsPerPage]);

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const changeItemsPerPage = (num) => {
    setPagination((prev) => ({ ...prev, itemsPerPage: num, currentPage: 1 }));
  };

  const { currentPage, itemsPerPage } = pagination;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredUnits.slice(indexOfFirst, indexOfLast);

  return {
    units,
    currentItems,
    loading,
    toast,
    form,
    editingId,
    showFormModal,
    confirmModal,
    pagination,
    searchTerm,
    sortOrder,
    stats: { total: units.length, recentlyAdded: units.slice(-5).length },

    // Funciones
    setForm,
    setSearchTerm,
    toggleSortOrder,
    showToast,
    handleSubmit,
    handleOpenForm,
    handleCloseForm,
    confirmDelete,
    handleDelete,
    goToPage,
    changeItemsPerPage,
    setConfirmModal,
  };
}
