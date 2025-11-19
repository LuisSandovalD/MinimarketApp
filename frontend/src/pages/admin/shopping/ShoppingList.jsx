import useShopping from "@/components/features/shopping/hooks/useShopping";

import NavBarAdmin from "@/components/navbars/NavBarAdmin";
import Loading from "@/components/common/loaders/AppLoading";
import ConfirmDialog from "@/components/common/modals/ConfirmDialog";
import Pagination from "@/components/common/Pagination";

import ShoppingModal from "@/components/modalsForms/ShoppingFormModal";
import ShoppingHeader from "@/components/features/shopping/components/ShoppingHeader";
import ShoppingStats from "@/components/features/shopping/components/ShoppingStats";
import ShoppingTable from "@/components/features/shopping/components/ShoppingTable";
import ShoppingError from "@/components/features/shopping/components/ShoppingError";

const ShoppingList = () => {
  const shoppingHook = useShopping();

  const {
    setConfirmModal,
    loading,
    error,
    showModal,
    confirmModal,
    filters,
    showAdvancedFilters,
    setShowAdvancedFilters,
    paginatedData,
    handleFilterChange,
    clearAllFilters,
    openModal,
    closeModal,
    handleSubmit,
    confirmDelete,
    handleDelete,
    pagination,
    goToPage,
    changeItemsPerPage,
    getPageNumbers,
    stats,
    products,
    users,
    suppliers,
    categories,
    editingItem,
    formData,
    setFormData,
  } = shoppingHook;

  /** --------------------------
   *   ESTADOS DE CARGA / ERROR
   * -------------------------*/
  if (loading) return <Loading />;
  if (error) return <ShoppingError error={error} />;

  return (
    <div className="flex min-h-screen">
      {/* MAIN CONTENT */}
      <div className="flex-1 ml-0 lg:ml-72 transition-all duration-300">
        <NavBarAdmin />

        <main className="p-6">

          {/* HEADER */}
          <ShoppingHeader onOpenModal={openModal} />

          {/* ESTADÍSTICAS */}
          <ShoppingStats stats={stats} count={paginatedData.length} />

          {/* TABLA Y FILTROS */}
          <ShoppingTable
            data={paginatedData}
            suppliers={suppliers}
            users={users}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={clearAllFilters}
            onEdit={openModal}
            onDelete={confirmDelete}
            showAdvancedFilters={showAdvancedFilters}
            onToggleFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
            searchValue={filters.search || ""}
            onSearchChange={(value) => handleFilterChange("search", value)}
          />

          {/* PAGINACIÓN */}
          <Pagination
            pagination={pagination}
            goToPage={goToPage}
            changeItemsPerPage={changeItemsPerPage}
            getPageNumbers={getPageNumbers}
          />
        </main>
      </div>

      {/* CONFIRMAR ELIMINACIÓN */}
      <ConfirmDialog
        open={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, id: null })}      // ← BUG arreglado
        onConfirm={handleDelete}
        title="Eliminar Compra"
        message="¿Estás seguro de eliminar esta compra?"
      />

      {/* MODAL DE FORMULARIO */}
      <ShoppingModal
        show={showModal}
        onClose={closeModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        products={products}
        users={users}
        suppliers={suppliers}
        categories={categories}
        editingItem={editingItem}
      />
    </div>
  );
};

export default ShoppingList;
