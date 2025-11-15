// src/pages/admin/products/ProductList.jsx
import { motion, AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import Loading from "@/components/common/loaders/AppLoading";
import Pagination from "@/components/common/Pagination";
import useProductList from "../../../components/features/products/hooks/useProductList";
import ProductHeader from "../../../components/features/products/components/ProductHeader";
import ProductStats from "../../../components/features/products/components/ProductStats";
import ProductValueBanner from "../../../components/features/products/components/ProductValueBanner";
import ProductFilterBar from "../../../components/features/products/components/ProductFilterBar";
import ProductGrid from "../../../components/features/products/components/ProductGrid";
import ProductListTable from "../../../components/features/products/components/ProductListTable";
import ProductSelectionButton from "../../../components/features/products/components/ProductSelectionButton";
import {FullscreenButton} from "@/components/common/buttons";


export default function ProductList() {
  const {
    loading,
    error,
    stats,
    totalInventoryValue,
    currentProducts,
    viewMode,
    setViewMode,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    pagination,
    goToPage,
    changeItemsPerPage,
    getPageNumbers,
    selectedItems,
    setSelectedItems,
    handleSelectItem,
    handleSendSelectedData,
    filtered,
    products
  } = useProductList();

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 p-6 font-medium">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 lg:pt-0 pt-0">
      <div className="flex-1 p-4 m-0 lg:ml-72 transition-all duration-300">
        <div className="mb-8">
          <NavBarAdmin />
          <ProductHeader products={filtered} />
        </div>

        <ProductStats stats={stats} />
        <ProductValueBanner totalValue={totalInventoryValue} />

        <ProductFilterBar
          search={search}
          setSearch={setSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          toggleSortOrder={toggleSortOrder}
          viewMode={viewMode}
          setViewMode={setViewMode}
          totalFiltered={filtered.length}
          totalProducts={products.length}
        />

        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            viewMode === "grid" ? (
              <ProductGrid
                products={currentProducts}
                selectedItems={selectedItems}
                onSelectItem={handleSelectItem}
                onSendSelected={handleSendSelectedData}
              />
            ) : (
              <ProductListTable
                products={currentProducts}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                onSelectItem={handleSelectItem}
              />
            )
          ) : (
            <div className="text-center py-10 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm">
              <Package className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-semibold text-slate-900">No hay productos</h3>
              <p className="mt-1 text-sm text-slate-500">
                Ajusta tu búsqueda, filtro u orden para ver productos.
              </p>
            </div>
          )}
        </AnimatePresence>

        {filtered.length > 0 && (
          <div className="mt-8">
            <Pagination
              pagination={pagination}
              goToPage={goToPage}
              getPageNumbers={getPageNumbers}
              changeItemsPerPage={changeItemsPerPage}
            />
          </div>
        )}
      </div>

      <ProductSelectionButton
        selectedCount={selectedItems.length}
        onClick={handleSendSelectedData}
      />
    </div>
  );
}
