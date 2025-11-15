import { useState } from "react";
import { AnimatePresence } from "framer-motion";

// Hooks
import useSales from "@/components/features/sales/hooks/useSales";

// Components
import NavBarAdmin from "@/components/navbars/NavBarAdmin";
import Loading from "@/components/common/loaders/AppLoading";
import ConfirmDialog from "@/components/common/modals/ConfirmDialog";
import Pagination from "@/components/common/Pagination";

// Feature Components
import SalesHeader from "@/components/features/sales/componnets/SalesHeader";
import SalesStats from "@/components/features/sales/componnets/SalesStats";
import SalesFilters from "@/components/features/sales/componnets/SalesFilters";
import SalesTable from "@/components/features/sales/componnets/SalesTable";
import SalesEmptyState from "@/components/features/sales/componnets/SalesEmptyState";

// Modals
import ModalSales from "@/components/modalsForms/SalesListFormModal";
import ModalDocuments from "@/components/modalsForms/DocumentsFormModal";
import SaleDetailsModal from "../../../components/features/sales/componnets/SaleDetailsModal";
import EmptyState from "../../../components/features/sales/componnets/EmptyState";

const SalesList = () => {
  const {
    filtered,
    currentSales,
    search,
    handleSearch,
    users,
    paymentMethod,
    customers,
    documents,
    loading,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    sortBy,
    handleSortChange,
    sortOrder,
    toggleSortOrder,
    activeFiltersCount,
    clearFilters,
    pagination,
    goToPage,
    changeItemsPerPage,
    getPageNumbers,
    fetchSales,
    handleDelete,
    totalSales,
    creditSales,
    totalCredit,
    totalCash,
  } = useSales();

  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsSale, setDetailsSale] = useState(null);

  const handleDocuments = (saleId) => {
    const doc = documents.find((d) => d.sale_id === saleId);
    const sale = filtered.find((s) => s.id === saleId);
    if (!doc) return alert("No hay documento asociado a esta venta.");
    setSelectedDocument({ ...doc, sale });
    setShowDocumentModal(true);
  };

  const handleEdit = (sale) => {
    const normalizedSale = {
      ...sale,
      details: (sale.details || []).map((detail) => ({
        product_id: detail.product_id,
        product_name: detail.product?.name || "",
        quantity: Number(detail.quantity) || 1,
        unit_price: Number(detail.unit_price) || 0,
        total_price: Number(detail.subtotal) || 0,
        code: detail.product?.code || "",
      })),
      is_credit: !!sale.credit,
      interest_rate: sale.credit?.interest_rate || 0,
      due_date: sale.credit?.due_date?.slice(0, 10) || "",
    };
    setSelectedSale(normalizedSale);
    setShowSaleModal(true);
  };

  const handleViewDetails = (sale) => {
    setDetailsSale(sale);
    setShowDetailsModal(true);
  };

  const confirmDelete = (id) => setConfirmModal({ show: true, id });

  const onConfirmDelete = async () => {
    await handleDelete(confirmModal.id);
    setConfirmModal({ show: false, id: null });
  };

  const currentPageTotal = currentSales.reduce((sum, s) => sum + Number(s.total), 0);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen">
      <NavBarAdmin />
      <div className="flex-1 lg:ml-72 p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <SalesHeader
            onNewSale={() => {
              setSelectedSale(null);
              setShowSaleModal(true);
            }}
            sales={filtered}
          />

          <SalesStats
            totalSales={totalSales}
            totalCredit={totalCredit}
            totalCash={totalCash}
            salesCount={filtered.length}
            creditCount={creditSales.length}
            cashCount={filtered.length - creditSales.length}
          />

          <SalesFilters
            search={search}
            onSearchChange={handleSearch}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            sortOrder={sortOrder}
            toggleSortOrder={toggleSortOrder}
            activeFiltersCount={activeFiltersCount}
            clearFilters={clearFilters}
            paymentMethods={paymentMethod}
            customers={customers}
          />
        </div>

        {filtered.length === 0 ? (
          search || activeFiltersCount > 0 ? (
            <SalesEmptyState hasFilters={true} onClearFilters={clearFilters} />
          ) : (
            <EmptyState />
          )
        ) : (
          <>
            <SalesTable
              sales={currentSales}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onViewDocument={handleDocuments}
              onDelete={confirmDelete}
              currentPageTotal={currentPageTotal}
              totalAmount={filtered.length}
            />
            <Pagination
              pagination={pagination}
              goToPage={goToPage}
              changeItemsPerPage={changeItemsPerPage}
              getPageNumbers={getPageNumbers}
            />
          </>
        )}

        {/* Modales */}
        <ModalSales
          show={showSaleModal}
          onClose={() => {
            setShowSaleModal(false);
            setSelectedSale(null);
          }}
          onSaved={() => {
            fetchSales();
            setShowSaleModal(false);
            setSelectedSale(null);
          }}
          users={users}
          customers={customers}
          paymentMethod={paymentMethod}
          sale={selectedSale}
          editing={!!selectedSale}
        />

        <ModalDocuments
          show={showDocumentModal}
          doc={selectedDocument}
          onClose={() => {
            setShowDocumentModal(false);
            setSelectedDocument(null);
          }}
        />

        <AnimatePresence>
          {showDetailsModal && (
            <SaleDetailsModal
              show={showDetailsModal}
              sale={detailsSale}
              onClose={() => {
                setShowDetailsModal(false);
                setDetailsSale(null);
              }}
            />
          )}
        </AnimatePresence>

        <ConfirmDialog
          open={confirmModal.show}
          onClose={() => setConfirmModal({ show: false, id: null })}
          onConfirm={onConfirmDelete}
          title="Eliminar Venta"
          message="¿Estás seguro de eliminar esta venta? Esta acción no se puede deshacer."
        />
      </div>
    </div>
  );
};

export default SalesList;