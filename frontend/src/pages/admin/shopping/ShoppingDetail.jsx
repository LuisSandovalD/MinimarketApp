import { useState, useMemo } from "react";
import NavBarAdmin from "@/components/navbars/NavBarAdmin";
import Loading from "@/components/common/loaders/AppLoading";
import { useShoppingDetail } from "../../../components/features/shoppingDetail/hooks/useShoppingDetail";
import { useShoppingFilters } from "../../../components/features/shoppingDetail/hooks/useShoppingFilters";
import { useShoppingExport } from "../../../components/features/shoppingDetail/hooks/useShoppingExport";
import { calculateStats, groupDetailsByShoppingId } from "../../../components/features/shoppingDetail/utils/calculations";

// Importar componentes modulares
import ShoppingDetailHeader from "../../../components/features/shoppingDetail/components/ShoppingDetailHeader";
import ShoppingDetailStats from "../../../components/features/shoppingDetail/components/ShoppingDetailStats";
import ShoppingDetailFilters from "../../../components/features/shoppingDetail/components/ShoppingDetailFilters";
import ShoppingDetailSummary from "../../../components/features/shoppingDetail/components/ShoppingDetailSummary";
import ShoppingDetailEmpty from "../../../components/features/shoppingDetail/components/ShoppingDetailEmpty";
import TableView from "../../../components/features/shoppingDetail/components/views/TableView";
import CardsView from "../../../components/features/shoppingDetail/components/views/CardsView";
import GroupedView from "../../../components/features/shoppingDetail/components/views/GroupedView";
import Pagination from "@/components/common/Pagination";


const ShoppingDetail = () => {
  const [viewMode, setViewMode] = useState("grouped");
  const [expandedGroups, setExpandedGroups] = useState({});

  // Hooks personalizados
  const { details, loading } = useShoppingDetail();
  const { exportToCSV } = useShoppingExport();

  const {
    searchTerm,
    setSearchTerm,
    selectedShopping,
    setSelectedShopping,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredDetails,
    uniqueShoppings,
    clearFilters,
    toggleSort,
  } = useShoppingFilters(details);

  // -----------------------------------------
  // PAGINACIÓN (basada en filteredDetails)
  // -----------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const totalItems = filteredDetails.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedDetails = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDetails.slice(start, start + itemsPerPage);
  }, [filteredDetails, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const changeItemsPerPage = (num) => {
    setItemsPerPage(num);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pagination = {
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
  };

  // -----------------------------------------

  // Cálculos
  const stats = calculateStats(filteredDetails);

  // Vista agrupada (se pagina ANTES de agrupar)
  const groupedDetails = groupDetailsByShoppingId(paginatedDetails);

  const toggleGroup = (shoppingId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [shoppingId]: !prev[shoppingId],
    }));
  };

  const handleExport = () => exportToCSV(filteredDetails);

  if (loading) return <Loading />;

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 ml-0 lg:ml-72 transition-all duration-300">
        <NavBarAdmin />

        <main className="p-6">
          <div className="mb-8">
            <ShoppingDetailHeader onExport={handleExport} />

            <ShoppingDetailStats stats={stats} />

            <ShoppingDetailFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedShopping={selectedShopping}
              setSelectedShopping={setSelectedShopping}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              uniqueShoppings={uniqueShoppings}
              clearFilters={clearFilters}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            {filteredDetails.length > 0 && (
              <ShoppingDetailSummary
                stats={stats}
                filteredCount={filteredDetails.length}
                totalCount={details.length}
              />
            )}
          </div>

          {/* CONTENIDO */}
          {filteredDetails.length === 0 ? (
            <ShoppingDetailEmpty
              hasFilters={!!(searchTerm || selectedShopping)}
              onClearFilters={clearFilters}
            />
          ) : viewMode === "table" ? (
            <TableView
              filteredDetails={paginatedDetails}
              sortBy={sortBy}
              sortOrder={sortOrder}
              toggleSort={toggleSort}
            />
          ) : viewMode === "cards" ? (
            <CardsView filteredDetails={paginatedDetails} />
          ) : (
            <GroupedView
              groupedDetails={groupedDetails}
              expandedGroups={expandedGroups}
              toggleGroup={toggleGroup}
            />
          )}

          {/* PAGINACIÓN */}
          {filteredDetails.length > 0 && (
            <Pagination
              pagination={pagination}
              goToPage={goToPage}
              changeItemsPerPage={changeItemsPerPage}
              getPageNumbers={getPageNumbers}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ShoppingDetail;
