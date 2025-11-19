// src/components/dashboard/DashboardHeader.jsx

import { LayoutDashboard, Calendar } from 'lucide-react';
import AdminInfoPanel from "./AdminInfoPanel";
import DateFilter from "./DateFilter";
import { FullscreenButton } from '../../../common/buttons';

export default function DashboardHeader({
    isAdmin, data, startDate, endDate, setStartDate, setEndDate,
    handleApplyFilter, handlePresetSelect, selectedPreset, formatDate
}) {
    return (
        <>
            <div className="mb-6 flex items-center justify-between flex-wrap pt-5">
                <div className="flex items-center gap-3 mb-2">
                    <div className='bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg'>
                        <LayoutDashboard className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 md:text-1xl lg:text-3xl">
                            Dashboard {isAdmin ? "Administrador" : "Cajero"}
                        </h2>
                        <p className="text-gray-600 mt-1 flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4" />
                            Período:{" "}
                            <span className="font-semibold">{formatDate(data.date_range.start)}</span> -{" "}
                            <span className="font-semibold">{formatDate(data.date_range.end)}</span>
                        </p>
                    </div>
                </div>
                <div className='flex gap-3 justify-end'>
                    <FullscreenButton className='shadow'/>
                    <AdminInfoPanel />
                </div>
            </div>

            {/* Filtro de fechas */}
            <DateFilter
                startDate={startDate}
                endDate={endDate}
                onStartChange={setStartDate}
                onEndChange={setEndDate}
                onApply={handleApplyFilter}
                onPresetSelect={handlePresetSelect}
                selectedPreset={selectedPreset}
                userRole={isAdmin ? "administrador" : "cajero"}
            />
        </>
    );
}