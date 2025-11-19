import NavBarAdmin from "@/components/navbars/NavBarAdmin";
import Loading from "@/components/common/loaders/AppLoading";
import Pagination from "@/components/common/Pagination";

import UnitFormModal from "@/components/modalsForms/UnitFormModal";
import ConfirmDialog from "@/components/common/modals/ConfirmDialog";

import UnitFilters from "@/components/features/unitCategory/components/UnitFilters";
import UnitStats from "@/components/features/unitCategory/components/UnitStats";
import UnitList from "@/components/features/unitCategory/components/UnitList";
import UnitHeader from "@/components/features/unitCategory/components/UnitHeader";

import useUnits  from "../../../components/features/unitCategory/hooks/useUnits";
import UnitToast from "../../../components/features/unitCategory/components/UnitToast"

export default function UnitCategory() {
  const U = useUnits();

  if (U.loading) return <Loading />;

  return (
    <div className="flex flex-col sm:flex-col md:flex-row min-h-screen ">

      <NavBarAdmin />

      {/* Toast */}
      <UnitToast toast={U.toast} />

      {/* MAIN */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-72">
        <UnitHeader handleOpenForm={U.handleOpenForm} />

        <UnitStats stats={U.stats} />

        <UnitFilters
          searchTerm={U.searchTerm}
          setSearchTerm={U.setSearchTerm}
          sortOrder={U.sortOrder}
          toggleSortOrder={U.toggleSortOrder}
          filteredCount={U.filteredCount}
          totalCount={U.totalCount}
        />

        <UnitList
          units={U.currentItems}
          onEdit={U.handleOpenForm}
          onDelete={U.confirmDelete}
          onCreate={U.handleOpenForm}
          searchTerm={U.searchTerm}
        />

        <div className="mt-8">
          <Pagination
            pagination={U.pagination}
            goToPage={U.goToPage}
            changeItemsPerPage={U.changeItemsPerPage}
            getPageNumbers={U.getPageNumbers}
          />
        </div>
      </main>

      {/* Form Modal */}
      {U.showFormModal && (
        <UnitFormModal
          open={U.showFormModal}
          onClose={U.handleCloseForm}
          form={U.form}
          onChange={U.handleChange}
          onSubmit={U.handleSubmit}
          editingId={U.editingId}
        />
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        open={U.confirmModal.show}
        onClose={() => U.setConfirmModal({ show: false, unit: null })}
        onConfirm={U.handleDelete}
        title="Eliminar Unidad"
        message={`¿Eliminar la unidad "${U.confirmModal.unit?.name}" (${U.confirmModal.unit?.abbreviation})?`}
      />
    </div>
  );
}
