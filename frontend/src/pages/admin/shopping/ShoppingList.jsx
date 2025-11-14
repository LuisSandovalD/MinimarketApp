import React from "react";
import useShopping from "../../../components/features/shopping/hooks/useShopping";
import NavBarAdmin from "@/components/navbars/NavBarAdmin";
import Loading from "@/components/common/loaders/AppLoading";
import ConfirmDialog from "@/components/common/modals/ConfirmDialog";
import Pagination from "@/components/common/Pagination";
import ShoppingModal from "@/components/modalsForms/ShoppingFormModal";
import ShoppingHeader from "../../../components/features/shopping/components/ShoppingHeader";
import ShoppingStats from "../../../components/features/shopping/components/ShoppingStats";
import ShoppingTable from "../../../components/features/shopping/components/ShoppingTable";
import ShoppingEmpty from "../../../components/features/shopping/components/ShoppingEmpty";
import ShoppingError from "../../../components/features/shopping/components/ShoppingError";

const ShoppingList = () => {
  const shoppingHook = useShopping();
  const {
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
  } = shoppingHook;

  if (loading) return <Loading />;
  if (error) return <ShoppingError error={error} />;

  return (
    <div className="flex bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      <div className="flex-1 ml-0 lg:ml-72 transition-all duration-300">
        <NavBarAdmin />
        <main className="p-6">

          {/* SOLO mantiene "Nueva compra" */}
          <ShoppingHeader
            onOpenModal={openModal}
          />

          {/* Estadísticas */}
          <ShoppingStats stats={stats} count={paginatedData.length} />


          {/* Filtros avanzados */}
          

          {/* TABLA con buscador + botón de filtro */}
            <ShoppingTable
            filters={filters}
              onFilterChange={handleFilterChange}
              suppliers={suppliers}
              users={users}
              onClear={clearAllFilters}
              data={paginatedData}
              onEdit={openModal}
              onDelete={confirmDelete}
              showAdvancedFilters={showAdvancedFilters}
              onToggleFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
              searchValue={filters.search || ""}
              onSearchChange={(value) => handleFilterChange("search", value)}
            />


          {/* Paginación */}
          <Pagination
            pagination={pagination}
            goToPage={goToPage}
            changeItemsPerPage={changeItemsPerPage}
            getPageNumbers={getPageNumbers}
          />
        </main>
      </div>

      <ConfirmDialog
        open={confirmModal.show}
        onClose={() => confirmModal.setShow(false)}
        onConfirm={handleDelete}
        title="Eliminar Compra"
        message="¿Estás seguro de eliminar esta compra?"
      />

      <ShoppingModal
        show={showModal}
        onClose={closeModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={shoppingHook.setFormData}
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
