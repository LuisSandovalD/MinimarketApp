import { useEffect, useState, useCallback } from "react";
import { getUnits, createUnit, putUnit, deleteUnit } from "@/api";
import NavBarAdmin from "@/components/navbars/NavBarAdmin";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, CheckCircle, XCircle, Ruler } from "lucide-react";

import Loading from "@/components/common/loaders/AppLoading";
import UnitFormModal from "@/components/modalsForms/UnitFormModal";
import ConfirmDialog from "@/components/common/modals/ConfirmDialog";
import Pagination from "@/components/common/Pagination";

import UnitFilters from "../../../components/features/unitCategory/components/UnitFilters";
import UnitStats from "../../../components/features/unitCategory/components/UnitStats";
import UnitList from "../../../components/features/unitCategory/components/UnitList";

export default function UnitCategory() {
  const [units, setUnits] = useState([]);
  const [form, setForm] = useState({ name: "", abbreviation: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, unit: null });
  const [sortOrder, setSortOrder] = useState("asc");

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

  const filteredAndSortedUnits = units
    .filter((u) =>
      [u.name, u.abbreviation].join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const compareValue = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? compareValue : -compareValue;
    });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [searchTerm, sortOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = useCallback(() => {
    setForm({ name: "", abbreviation: "" });
    setEditingId(null);
  }, []);

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

  const toggleSortOrder = () => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const stats = {
    total: units.length,
    recentlyAdded: units.slice(-5).length,
  };

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
    )
      pages.push(i);

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

  const { currentPage, itemsPerPage } = pagination;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredAndSortedUnits.slice(indexOfFirst, indexOfLast);

  if (loading) return <Loading />;

  return (
    <div className="flex bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen lg:p-0 pt-16">
      <NavBarAdmin />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 z-50 flex items-center gap-3 bg-white shadow-xl rounded-lg px-5 py-3 border-l-4"
            style={{
              borderLeftColor: toast.type === "success" ? "#10B981" : "#EF4444",
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle className="text-green-500" size={22} />
            ) : (
              <XCircle className="text-red-500" size={22} />
            )}
            <span className="text-sm font-medium text-slate-700">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-72 transition-all duration-300">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
              <Ruler className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Unidades de Medida</h1>
              <p className="text-slate-500 mt-1">Administra las unidades del sistema</p>
            </div>
          </div>
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            <PlusCircle size={20} />
            Nueva Unidad
          </button>
        </div>

        {/* Stats */}
        <UnitStats stats={stats} />

        {/* Filters */}
        <UnitFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOrder={sortOrder}
          toggleSortOrder={toggleSortOrder}
          filteredCount={filteredAndSortedUnits.length}
          totalCount={units.length}
        />

        {/* List */}
        <UnitList
          units={currentItems}
          onEdit={handleOpenForm}
          onDelete={confirmDelete}
          onCreate={handleOpenForm}
          searchTerm={searchTerm}
        />

        {/* Pagination */}
        <div className="mt-8">
          <Pagination
            pagination={pagination}
            goToPage={goToPage}
            changeItemsPerPage={changeItemsPerPage}
            getPageNumbers={getPageNumbers}
          />
        </div>
      </main>

      {/* Modals */}
      {showFormModal && (
        <UnitFormModal
          open={showFormModal}
          onClose={handleCloseForm}
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          editingId={editingId}
        />
      )}

      <ConfirmDialog
        open={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, unit: null })}
        onConfirm={handleDelete}
        title="Eliminar Unidad de Medida"
        message={`¿Estás seguro de eliminar la unidad "${confirmModal.unit?.name}" (${confirmModal.unit?.abbreviation})? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
