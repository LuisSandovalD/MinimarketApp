// Dashboard.jsx (Versión Modular)

import useDashboardLogic from "@/components/features/dashboard/hooks/useDashboardLogic"; // Asume la ruta
import Loading from "@/components/common/loaders/AppLoading";
import AlertMessage from "@/components/common/feedback/AlertMessage";

// Componentes modulares
import NavBarAdmin from "@/components/navbars/NavBarAdmin";
import DashboardHeader from "../../components/features/dashboard/componnets/DashboardHeader";
import DashboardMetrics from "../../components/features/dashboard/componnets/DashboardMetrics";
import BalanceSection from "../../components/features/dashboard/componnets/BalanceSection";
import CreditsSection from "../../components/features/dashboard/componnets/CreditsSection";
import SalesChart from "../../components/features/dashboard/componnets/SalesChart";
import TopProducts from "../../components/features/dashboard/componnets/TopProducts";
import TopCustomersTable from "../../components/features/dashboard/componnets/TopCustomersTable";
import {FullscreenButton} from "@/components/common/buttons";


export default function Dashboard() {
    const {
        loading, error, data, admin, isAdmin,
        startDate, setStartDate, endDate, setEndDate,
        handleApplyFilter, handlePresetSelect, selectedPreset,
        loadDashboardData, formatCurrency, formatDate,
        maxSale, maxProduct
    } = useDashboardLogic();

    if (loading && !data) return <Loading />;

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
                <div className="bg-white border-2 border-red-300 rounded-xl shadow-2xl p-8 max-w-md text-center space-y-6">
                    <AlertMessage message={error} type="error" />
                    <button
                        onClick={() => loadDashboardData(startDate, endDate)}
                        className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition shadow-lg"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className='min-h-screen lg:pt-0'>
            <div className='flex-1 lg:ml-72 pt-0 lg:pt-0 p-4 sm:p-6 lg:p-8'>
                <NavBarAdmin />
                
                {/* Título y Filtro */}
                <DashboardHeader
                    isAdmin={isAdmin}
                    data={data}
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    handleApplyFilter={handleApplyFilter}
                    handlePresetSelect={handlePresetSelect}
                    selectedPreset={selectedPreset}
                    formatDate={formatDate}
                />

                {/* Tarjetas de métricas principales */}
                <DashboardMetrics 
                    data={data} 
                    isAdmin={isAdmin} 
                    formatCurrency={formatCurrency} 
                />

                {/* Balance General (Solo Admin) */}
                <BalanceSection 
                    data={data} 
                    isAdmin={isAdmin} 
                    formatCurrency={formatCurrency} 
                />

                {/* Estadísticas de créditos */}
                <CreditsSection data={data} />

                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Ventas por día */}
                    <SalesChart 
                        data={data} 
                        maxSale={maxSale} 
                        formatCurrency={formatCurrency} 
                        formatDate={formatDate} 
                    />

                    {/* Top 5 productos */}
                    <TopProducts 
                        data={data} 
                        maxProduct={maxProduct} 
                    />
                </div>

                {/* Clientes frecuentes (Solo Admin) */}
                <TopCustomersTable 
                    data={data} 
                    isAdmin={isAdmin} 
                />

            </div>
        </div>
    );
}