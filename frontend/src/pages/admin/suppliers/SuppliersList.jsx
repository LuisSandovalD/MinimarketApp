import { useState } from "react";
import { Building2, CheckCircle, XCircle, Mail } from "lucide-react";
import NavBar from "../../../components/navbars/NavBarAdmin";
import ModalSupplier from "../../../components/modalsForms/SupplierFormModal";
import Loading from "@/components/common/loaders/AppLoading";
import Pagination from "@/components/common/Pagination";


// Hooks
import { useSuppliers } from "../../../components/features/suppliers/hooks/useSuppliers";
import { useSupplierFilters } from "../../../components/features/suppliers/hooks/useSupplierFilters";
import { usePagination } from "../../../components/features/suppliers/hooks/usePagination";
import ConfirmDialog from "@/components/common/modals/ConfirmDialog";

// Utils
import { calculateSupplierStats, exportToCSV, exportToPDF } from "../../../components/features/suppliers/utils/exportUtils";

// Components
import { StatCard } from "../../../components/features/suppliers/components/StatCard";
import { EmptyState } from "../../../components/features/suppliers/components/EmptyState";
import { ErrorState } from "../../../components/features/suppliers/components/ErrorState";
import { SupplierHeader } from "../../../components/features/suppliers/components/SupplierHeader";
import { SearchAndFilters } from "../../../components/features/suppliers/components/SearchAndFilters";
import { SuppliersTable } from "../../../components/features/suppliers/components/SuppliersTable";


export default function SuppliersList() {
  // Data management
  const { suppliers, loading, error, fetchSuppliers, removeSupplier } = useSuppliers();

  // Filters and search
  const {
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterHasEmail,
    setFilterHasEmail,
    filterHasPhone,
    setFilterHasPhone,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    filtered,
    activeFiltersCount,
    clearFilters,
  } = useSupplierFilters(suppliers);

  // Pagination
  const { pagination, currentItems, goToPage, changeItemsPerPage, getPageNumbers } =
    usePagination(filtered);

  // UI state
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Handlers
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
    if (supplierToDelete) {
      await removeSupplier(supplierToDelete.id);
    }
    setShowDeleteModal(false);
    setSupplierToDelete(null);
  };

  const handleExportCSV = () => {
    exportToCSV(filtered);
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    exportToPDF(filtered);
    setShowExportMenu(false);
  };

  // Stats
  const stats = calculateSupplierStats(suppliers);

  // Loading and error states
  if (loading) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={fetchSuppliers} />;

  return (
    <div className="flex min-h-screen lg:p-0 pt-16">
      <NavBar />
      <div className="flex-1 lg:ml-72 pt-20 lg:pt-0 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <SupplierHeader
            onNewSupplier={() => handleOpenModal()}
            showExportMenu={showExportMenu}
            setShowExportMenu={setShowExportMenu}
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
          />

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Building2} label="Total Proveedores" value={stats.total} />
            <StatCard icon={CheckCircle} label="Activos" value={stats.active} />
            <StatCard icon={XCircle} label="Inactivos" value={stats.inactive} />
            <StatCard icon={Mail} label="Con Email" value={stats.withEmail} />
          </div>

          {/* Search and Filters */}
          <SearchAndFilters
            search={search}
            setSearch={setSearch}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            activeFiltersCount={activeFiltersCount}
            toggleSortOrder={toggleSortOrder}
            sortOrder={sortOrder}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterHasEmail={filterHasEmail}
            setFilterHasEmail={setFilterHasEmail}
            filterHasPhone={filterHasPhone}
            setFilterHasPhone={setFilterHasPhone}
            sortBy={sortBy}
            setSortBy={setSortBy}
            clearFilters={clearFilters}
          />
        </div>

        {/* Table or Empty State */}
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
            <SuppliersTable
              suppliers={currentItems}
              onEdit={handleOpenModal}
              onDelete={confirmDelete}
            />

            {/* Pagination */}
            <Pagination
              pagination={pagination}
              goToPage={goToPage}
              changeItemsPerPage={changeItemsPerPage}
              getPageNumbers={getPageNumbers}
            />
          </>
        )}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <ModalSupplier
          supplier={selectedSupplier}
          onClose={handleCloseModal}
          onSaved={handleSaved}
        />
      )}

  <ConfirmDialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Eliminar Proveedor"
        message={`¿Estás seguro de eliminar al usuario "${supplierToDelete?.name}"? Esta acción no se puede deshacer.`}
      />
      
    </div>
  );
}