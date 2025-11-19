import { useState, useEffect, useCallback } from "react";
import { getCategories, createCategory, putCategory, deleteCategory, getUnits } from "@/api";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [form, setForm] = useState({ name: "", description: "", unit_id: "", active: true });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null, name: "" });
  const [showModal, setShowModal] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 6,
    totalItems: 0,
    totalPages: 1,
  });

  // Fetch inicial
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, unitRes] = await Promise.all([getCategories(), getUnits()]);
      setCategories(catRes || []);
      setFiltered(catRes || []);
      setUnits(unitRes || []);
    } catch {
      showToast("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  };

  // Toast reutilizable
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const resetForm = useCallback(() => {
    setForm({ name: "", description: "", unit_id: "", active: true });
    setEditingId(null);
  }, []);

  // CRUD
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return showToast("El nombre es requerido", "error");
    if (!form.unit_id) return showToast("La unidad es requerida", "error");

    try {
      if (editingId) {
        await putCategory(editingId, form);
        showToast("Categoría actualizada correctamente");
      } else {
        await createCategory(form);
        showToast("Categoría creada correctamente");
      }
      resetForm();
      setShowModal(false);
      fetchData();
    } catch {
      showToast("Error al guardar", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(confirmModal.id);
      showToast("Categoría eliminada correctamente");
      fetchData();
    } catch {
      showToast("Error al eliminar categoría", "error");
    } finally {
      setConfirmModal({ show: false, id: null, name: "" });
    }
  };

  // Filtros + ordenamiento
  useEffect(() => {
    let result = [...categories];
    const q = search.toLowerCase();

    if (q)
      result = result.filter((c) =>
        [c.name, c.description, c.unit?.name].join(" ").toLowerCase().includes(q)
      );

    if (filterStatus !== "all")
      result = result.filter((c) => (filterStatus === "active" ? c.active : !c.active));

    result.sort((a, b) => {
      const aVal = sortBy === "unit" ? a.unit?.name || "" : a.name.toLowerCase();
      const bVal = sortBy === "unit" ? b.unit?.name || "" : b.name.toLowerCase();
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    setFiltered(result);
    setPagination((prev) => ({
      ...prev,
      totalItems: result.length,
      totalPages: Math.ceil(result.length / prev.itemsPerPage),
      currentPage: 1,
    }));
  }, [categories, search, filterStatus, sortBy, sortOrder]);

  return {
    // Datos
    categories, units, filtered, form, pagination,
    toast, loading, confirmModal, showModal,
    editingId, search, filterStatus, sortBy, sortOrder,

    // Funciones
    setForm, setSearch, setFilterStatus, setSortBy, setSortOrder,
    goToPage: (p) => setPagination((prev) => ({ ...prev, currentPage: p })),
    changeItemsPerPage: (limit) =>
      setPagination((prev) => ({
        ...prev,
        itemsPerPage: limit,
        totalPages: Math.ceil(prev.totalItems / limit),
      })),
    handleSubmit, handleDelete, resetForm, showToast,
    setConfirmModal, setShowModal, setEditingId,
  };
}
