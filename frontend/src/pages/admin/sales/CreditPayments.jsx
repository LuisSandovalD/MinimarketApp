import React from "react";
import { Receipt, DollarSign, Calendar } from "lucide-react";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import Loading from "@/components/common/loaders/AppLoading";

// Hooks
import { useCreditPayments } from "../../../components/features/creditPayments/hooks/useCreditPayments";
import { usePaymentFilters } from "../../../components/features/creditPayments/hooks/usePaymentFilters";
import FullscreenButton  from "../../../components/common/buttons/FullscreenButton";


// Utils
import { calculatePaymentStats, exportPaymentsToExcel } from "../../../components/features/creditPayments/utils/paymentUtils";

// Components
import { StatCard } from "../../../components/features/creditPayments/components/StatCard";
import { PaymentFilters } from "../../../components/features/creditPayments/components/PaymentFilters";
import { PaymentsTable } from "../../../components/features/creditPayments/components/PaymentsTable";
import { EmptyState } from "../../../components/features/creditPayments/components/EmptyState";

export default function CreditPayments() {
  // Data management
  const { payments, loading, error } = useCreditPayments();

  // Filters and sorting
  const {
    search,
    setSearch,
    dateFilter,
    setDateFilter,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    filtered,
  } = usePaymentFilters(payments);

  // Calculate stats
  const stats = calculatePaymentStats(filtered);

  // Export handler
  const handleExport = () => {
    exportPaymentsToExcel(filtered, stats);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="bg-white border border-red-200 rounded-xl p-8 max-w-md">
          <p className="text-red-600 font-semibold mb-2">Error al cargar datos</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex-1 p-8 ml-0 lg:ml-72 transition-all duration-300">
        <NavBarAdmin />

        {/* Header */}
        <div className="mb-6 flex justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">
            Pagos de Créditos
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Registro completo de pagos realizados
            </p>
          </div>
          <FullscreenButton className='shadow'/>
          
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={Receipt}
            label="Total Pagos"
            value={stats.totalPagos}
          />
          <StatCard
            icon={DollarSign}
            label="Monto Total"
            value={`S/ ${stats.montoTotal.toFixed(2)}`}
          />
          <StatCard
            icon={Calendar}
            label="Promedio"
            value={`S/ ${stats.promedioMonto.toFixed(2)}`}
          />
        </div>

        {/* Filtros */}
        <PaymentFilters
          search={search}
          setSearch={setSearch}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          toggleSortOrder={toggleSortOrder}
          onExport={handleExport}
          totalFiltered={filtered.length}
          totalPayments={payments.length}
        />

        {/* Tabla o Empty State */}
        {filtered.length === 0 ? (
          <EmptyState search={search} dateFilter={dateFilter} />
        ) : (
          <PaymentsTable
            payments={filtered}
            montoTotal={stats.montoTotal}
          />
        )}
      </div>
    </div>
  );
}