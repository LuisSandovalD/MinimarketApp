// src/features/customers/hooks/useDashboardLogic.js
// O simplemente src/hooks/useDashboardLogic.js

import { useState, useEffect } from 'react';
import { getDashboardData, getUser } from "@/api";

// 🔹 Función auxiliar para formatear fecha (necesaria para calculateDateRange)
const formatDateInternal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 🔹 Calcular rango de fechas según el preset
const calculateDateRange = (preset) => {
    const today = new Date();
    let start, end;

    switch (preset) {
        case 'today':
            start = end = formatDateInternal(today);
            break;

        case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            start = end = formatDateInternal(yesterday);
            break;

        case 'last7days': {
            const startDate = new Date();
            startDate.setDate(today.getDate() - 6);
            start = formatDateInternal(startDate);
            end = formatDateInternal(new Date());
            break;
        }

        case 'last30days': {
            const startDate = new Date();
            startDate.setDate(today.getDate() - 29);
            start = formatDateInternal(startDate);
            end = formatDateInternal(new Date());
            break;
        }

        case 'thisMonth':
            start = formatDateInternal(new Date(today.getFullYear(), today.getMonth(), 1));
            end = formatDateInternal(today);
            break;

        case 'lastMonth': {
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
            start = formatDateInternal(lastMonth);
            end = formatDateInternal(lastMonthEnd);
            break;
        }

        // *** NUEVOS PRESETS ***

        case 'last3months': {
            const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
            start = formatDateInternal(startDate);
            end = formatDateInternal(today);
            break;
        }

        case 'last6months': {
            const startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);
            start = formatDateInternal(startDate);
            end = formatDateInternal(today);
            break;
        }

        case 'thisYear':
            start = formatDateInternal(new Date(today.getFullYear(), 0, 1));
            end = formatDateInternal(today);
            break;

        case 'lastYear': {
            const year = today.getFullYear() - 1;
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);
            start = formatDateInternal(startDate);
            end = formatDateInternal(endDate);
            break;
        }

        case 'last2years': {
            const endDate = today;
            const startDate = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
            start = formatDateInternal(startDate);
            end = formatDateInternal(endDate);
            break;
        }

        // Si no coincide con ningún preset
        default:
            start = end = null;
    }

    return { start, end };
};


export default function useDashboardLogic() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [admin, setAdmin] = useState(null);

    // Estados para el filtro de fechas
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [appliedStartDate, setAppliedStartDate] = useState(null);
    const [appliedEndDate, setAppliedEndDate] = useState(null);
    const [selectedPreset, setSelectedPreset] = useState('last30days');

    const isAdmin = admin?.roles == 'administrador'; // Simplificación de la comprobación

    // 🔹 Funciones de formato
    const formatCurrency = (value) =>
        new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value || 0);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // 🔹 Obtener usuario logueado
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser();
                setAdmin(userData);
            } catch (err) {
                console.error("Error al obtener el usuario:", err);
            }
        };
        fetchUser();
    }, []);

    // 🔹 Cargar datos del dashboard
    const loadDashboardData = async (start = null, end = null) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getDashboardData(start, end);
            setData(response);
        } catch (err) {
            setError('Error al cargar los datos del dashboard');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Cargar datos iniciales
    useEffect(() => {
        const { start, end } = calculateDateRange('last30days');
        setStartDate(start);
        setEndDate(end);
        setAppliedStartDate(start);
        setAppliedEndDate(end);
        loadDashboardData(start, end);
    }, []);

    // 🔹 Manejar selección de preset
    const handlePresetSelect = (preset) => {
        setSelectedPreset(preset);
        const { start, end } = calculateDateRange(preset);
        setStartDate(start);
        setEndDate(end);
        setAppliedStartDate(start);
        setAppliedEndDate(end);
        loadDashboardData(start, end);
    };

    // 🔹 Aplicar filtros personalizados
    const handleApplyFilter = () => {
        setAppliedStartDate(startDate || null);
        setAppliedEndDate(endDate || null);
        loadDashboardData(startDate || null, endDate || null);
    };
    
    // Cálculo de valores máximos para gráficos (se mantiene aquí por eficiencia)
    const maxSale = data ? Math.max(...data.charts.salesByDay.map(d => parseFloat(d.total))) : 0;
    const maxProduct = data ? Math.max(...data.charts.topProducts.map(p => p.total_quantity)) : 0;

    return {
        // Estados y Data
        loading, error, data, admin, isAdmin,
        startDate, setStartDate, endDate, setEndDate,
        appliedStartDate, appliedEndDate, selectedPreset,
        // Funciones
        loadDashboardData, handlePresetSelect, handleApplyFilter,
        formatCurrency, formatDate,
        // Valores derivados para gráficos
        maxSale, maxProduct
    };
}