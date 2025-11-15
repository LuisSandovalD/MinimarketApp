import React, { useState } from "react";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import Loading from "@/components/common/loaders/AppLoading";
import Pagination from "@/components/common/Pagination";

// Hooks
import { useSaleDetails } from "../../../components/features/saleDetails/hooks/useSaleDetails";
import { useSaleDetailFilters } from "../../../components/features/saleDetails/hooks/useSaleDetailFilters";
import { usePagination } from "../../../components/features/saleDetails/hooks/usePagination";

// Utils
import {
  calculateTotalGeneral,
  exportSaleDetailsToPDF,
  exportSaleDetailsToExcel,
} from "../../../components/features/saleDetails/utils/saleDetailUtils";
import FullscreenButton  from "../../../components/common/buttons/FullscreenButton";


// Components
import { FilterBar } from "../../../components/features/saleDetails/components/FilterBar";
import { SaleDetailsTable } from "../../../components/features/saleDetails/components/SaleDetailsTable";
import { EmptyState } from "../../../components/features/saleDetails/components/EmptyState";

export default function SaleDetail() {
  // Data management
  const { details, loading, error } = useSaleDetails();

  // Filters
  const {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    saleFilter,
    setSaleFilter,
    filtered,
    categories,
    sales,
    clearFilters,
    hasActiveFilters,
  } = useSaleDetailFilters(details);

  // Pagination
  const { pagination, currentItems, goToPage, changeItemsPerPage, getPageNumbers } =
    usePagination(filtered);

  // UI state
  const [showFilters, setShowFilters] = useState(false);

  // Calculate total
  const totalGeneral = calculateTotalGeneral(filtered);

  // Export handlers
  const handleExportPDF = () => {
    exportSaleDetailsToPDF(filtered, totalGeneral);
  };

  const handleExportExcel = () => {
    exportSaleDetailsToExcel(filtered, totalGeneral);
  };

  // Reset to first page when filtering
  const handleSearchChange = () => {
    goToPage(1);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="bg-white border border-red-200 rounded-xl p-8 max-w-md">
          <p className="text-red-600 font-semibold mb-2">
            Error al cargar datos
          </p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex-1 lg:ml-72 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8">
        <NavBarAdmin />

        <div className="mt-6 flex-1">
          {/* Header */}
          <div className="mb-6 flex justify-between">
            <div>
               <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Detalles de Ventas
              </h2>
              <p className="text-sm text-gray-600">
                {filtered.length} registro{filtered.length !== 1 ? "s" : ""}{" "}
                encontrado{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            <FullscreenButton className='shadow'/>
          </div>

          {/* Filter Bar */}
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            saleFilter={saleFilter}
            setSaleFilter={setSaleFilter}
            categories={categories}
            sales={sales}
            clearFilters={clearFilters}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            onSearchChange={handleSearchChange}
          />

          {/* Table or Empty State */}
          {filtered.length === 0 ? (
            <EmptyState hasFilters={hasActiveFilters} />
          ) : (
            <>
              <SaleDetailsTable
                details={currentItems}
                startIndex={pagination.startIndex - 1}
                totalGeneral={totalGeneral}
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
      </div>
    </div>
  );
}