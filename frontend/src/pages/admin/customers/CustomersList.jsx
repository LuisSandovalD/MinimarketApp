import NavBarAdmin from "../../../components/navbars/NavBarAdmin";

import ModalCustomer from "../../../components/modalsForms/CustomerFormModal";
import ModalCustomerSales from "../../../components/modalsForms/SalesFormModal";
import ModalCustomerCredits from "../../../components/modalsForms/CreditsFormModal";

import CustomerHeader from "../../../components/features/customers/componnets/CustomerHeader";
import CustomersFilters from "../../../components/features/customers/componnets/CustomerFilters";
import CustomerTableSection from "../../../components/features/customers/componnets/CustomerTableSection";
import CustomerCard from "../../../components/features/customers/componnets/CustomerCard";

import EmptyStateWithFilters from "../../../components/features/customers/componnets/EmptyStateWithFilters";
import EmptyStateNoFilters from "../../../components/features/customers/componnets/EmptyStateNoFilters";

import ConfirmDialog from "../../../components/common/modals/ConfirmDialog";
import Loading from "@/components/common/loaders/AppLoading";
import useCustomersManager from "../../../components/features/customers/hooks/useCustomersManager";

import { Users, Mail, CreditCard, CheckCircle } from "lucide-react";
import { exportCustomersToExcel , exportCustomersToPDF } from "../../../components/features/customers/utils/exportUtils";



export default function CustomersList() {
  const {
    // Datos principales
    customers,
    filtered,
    search,
    setSearch,
    loading,
    error,

    // Loaders
    loadCustomers,
    loadCredits,

    // Eliminación
    customerToDelete,

    // Modales
    modalOpen,
    setModalOpen,
    selectedCustomer,
    setSelectedCustomer,

    modalSalesOpen,
    setModalSalesOpen,
    selectedCustomerSales,
    setSelectedCustomerSales,

    modalCreditsOpen,
    setModalCreditsOpen,
    selectedCustomerCredits,
    setSelectedCustomerCredits,

    setCustomerToDelete,

    // Export y alertas
    showExportMenu,
    setShowExportMenu,
    showFilters,
    setShowFilters,
    showAlertsPanel,
    setShowAlertsPanel,

    // Confirmación eliminar
    confirmOpen,
    setConfirmOpen,
    handleDeleteCustomer,
    confirmDelete,

    // Créditos
    overdueAlerts,
    getCustomerCredits,
    handleAlertClick,

    // Filtros
    filterStatus,
    setFilterStatus,
    filterHasCredits,
    setFilterHasCredits,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    clearFilters,
    activeFiltersCount,

    // Paginación
    pagination,
    goToPage,
    changeItemsPerPage,
    getPageNumbers,
    currentCustomers,

    // Métricas
    activeCustomers,
    customersWithEmail,
    customersWithPendingCredits,
  } = useCustomersManager();

  const exportToExcel = () => {
    exportCustomersToExcel(filtered, getCustomerCredits, setShowExportMenu);
  };

  const exportToPDF = () => {
    exportCustomersToPDF(filtered, getCustomerCredits, setShowExportMenu);
  };

    if (loading) return <Loading />;
    if (error) return <p className="text-red-500 p-6 font-medium">{error}</p>;
  
  return (
    <div className="min-h-screen bg-gray-50 lg:p-0">
      <NavBarAdmin />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-72">

        {/* Header */}
        <div className="mb-8">
          <CustomerHeader
            showAlertsPanel={showAlertsPanel}
            setShowAlertsPanel={setShowAlertsPanel}
            overdueAlerts={overdueAlerts}
            handleAlertClick={handleAlertClick}
            showExportMenu={showExportMenu}
            setShowExportMenu={setShowExportMenu}
            exportToExcel={exportToExcel}
            exportToPDF={exportToPDF}
            setSelectedCustomer={setSelectedCustomer}
            setModalOpen={setModalOpen}
          />

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <CustomerCard Icon={Users} label="Total Clientes" value={customers.length} color="bg-blue-500" />
            <CustomerCard Icon={CheckCircle} label="Activos" value={activeCustomers} color="bg-green-500" />
            <CustomerCard Icon={CreditCard} label="Con Créditos" value={customersWithPendingCredits} color="bg-cyan-500" />
            <CustomerCard Icon={Mail} label="Con Email" value={customersWithEmail} color="bg-purple-500" />
          </div>
        </div>

        {/* Filtros */}
        <CustomersFilters
          search={search}
          setSearch={setSearch}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeFiltersCount={activeFiltersCount}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterHasCredits={filterHasCredits}
          setFilterHasCredits={setFilterHasCredits}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          toggleSortOrder={toggleSortOrder}
          clearFilters={clearFilters}
        />

        {/* Tabla o Empty States */}
        {filtered.length === 0 ? (
          search || activeFiltersCount > 0 ? (
            <EmptyStateWithFilters clearFilters={clearFilters} />
          ) : (
            <EmptyStateNoFilters setSelectedCustomer={setSelectedCustomer} setModalOpen={setModalOpen} />
          )
        ) : (
          <CustomerTableSection
            currentCustomers={currentCustomers}
            getCustomerCredits={getCustomerCredits}
            setSelectedCustomer={setSelectedCustomer}
            setModalOpen={setModalOpen}
            setSelectedCustomerSales={setSelectedCustomerSales}
            setModalSalesOpen={setModalSalesOpen}
            setSelectedCustomerCredits={setSelectedCustomerCredits}
            setModalCreditsOpen={setModalCreditsOpen}
            handleDeleteCustomer={handleDeleteCustomer}
            pagination={pagination}
            goToPage={goToPage}
            changeItemsPerPage={changeItemsPerPage}
            getPageNumbers={getPageNumbers}
          />
        )}
      </div>

      {/* Modales */}
      {modalOpen && (
        <ModalCustomer
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          customer={selectedCustomer}
          onSuccess={loadCustomers}
        />
      )}

      {modalSalesOpen && selectedCustomerSales && (
        <ModalCustomerSales
          isOpen={modalSalesOpen}
          onClose={() => setModalSalesOpen(false)}
          customer={selectedCustomerSales}
        />
      )}

      {modalCreditsOpen && selectedCustomerCredits && (
        <ModalCustomerCredits
          isOpen={modalCreditsOpen}
          onClose={() => {
            setModalCreditsOpen(false);
            setSelectedCustomerCredits(null);
          }}
          customer={selectedCustomerCredits}
        />
      )}

      {/* Confirmación eliminar */}
      <ConfirmDialog
        open={Boolean(customerToDelete)}
        onClose={() => setCustomerToDelete(false)}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message="¿Seguro que deseas eliminar este cliente?"
      />
    </div>
  );
}
